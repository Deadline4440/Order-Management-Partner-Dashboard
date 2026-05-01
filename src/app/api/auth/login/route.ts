import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpSMS } from "@/lib/send-sms";
import { generateToken } from "@/lib/jwt";

interface LoginRequest {
  phone: string;
}

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body: LoginRequest = await req.json();

    console.log("📱 Login Request for phone:", body.phone);

    if (!body.phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await db.getUserByPhone(body.phone);

    console.log("🔍 User found:", !!user, user ? { name: user.firstName, verified: user.verified } : "none");

    if (!user || !user.verified) {
      return NextResponse.json({ error: "User not found or not verified. Please register." }, { status: 404 });
    }

    // Development shortcut: return token immediately
    if (process.env.NODE_ENV === "development") {
      const token = await generateToken(user.id, user.email);
      const response = NextResponse.json({ message: "Login successful (dev)", phone: body.phone, token }, { status: 200 });
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // Generate OTP for login
    const otp = generateOTP();

    // Save OTP for login
    console.log("💾 Saving Login OTP:", { phone: body.phone, otp });
    await db.saveOTP(body.phone, otp, "sms");

    // Send OTP via SMS
    const phoneWithCountryCode = body.phone.startsWith("+") ? body.phone : `+91${body.phone}`;
    await sendOtpSMS(phoneWithCountryCode, otp);

    // Log OTP in development
    console.log(`🔐 [LOGIN OTP] ${otp} for ${body.phone}`);

    return NextResponse.json({ message: "OTP sent for login", phone: body.phone }, { status: 200 });
  } catch (error) {
    console.error("Login request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
