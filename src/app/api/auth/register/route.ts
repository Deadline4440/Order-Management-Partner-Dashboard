import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOTPEmail, sendSMSOTP } from "@/lib/email";

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  otpMethod: "sms" | "email";
}

// Hash password (use bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
  try {
    const body: RegisterRequest = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.getUserByEmail(body.email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Check if phone already exists
    const existingPhone = await db.getUserByPhone(body.phone);
    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    console.log("📱 Register: Saving OTP for phone:", body.phone);
    await db.saveOTP(body.phone, otp, body.otpMethod);

    // Save temporary user data
    await db.saveTempUser(body.phone, {
      id: `temp_${body.phone}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      verified: false,
      createdAt: new Date(),
    });

    // Send OTP via selected method
    if (body.otpMethod === "sms") {
      await sendSMSOTP(body.phone, otp);
    } else {
      await sendOTPEmail(body.email, otp, body.firstName);
    }

    return NextResponse.json(
      {
        message: "Registration initiated. OTP sent to your " + body.otpMethod,
        phone: body.phone,
        otpMethod: body.otpMethod,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
