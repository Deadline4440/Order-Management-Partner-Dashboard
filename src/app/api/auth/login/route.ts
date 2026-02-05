import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { sendOtpSMS } from "@/lib/send-sms";

interface LoginRequest {
  phone: string;
}

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    console.log("📱 Login Request for phone:", body.phone);

    if (!body.phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.getUserByPhone(body.phone);

    console.log("🔍 User found:", !!user, user ? { name: user.firstName, verified: user.verified } : "none");

    if (!user || !user.verified) {
      return NextResponse.json(
        { error: "User not found or not verified. Please register." },
        { status: 404 }
      );
    }

    // Generate OTP for login
    const otp = generateOTP();

    // Save OTP for login (different from registration)
    console.log("💾 Saving Login OTP:", { phone: body.phone, otp });
    await db.saveOTP(body.phone, otp, "sms");

    // Send OTP via SMS
    const phoneWithCountryCode = body.phone.startsWith("+") ? body.phone : `+91${body.phone}`;
    await sendOtpSMS(phoneWithCountryCode, otp);


    // Log OTP in development
    console.log(`🔐 [LOGIN OTP] ${otp} for ${body.phone}`);

    return NextResponse.json(
      {
        message: "OTP sent for login",
        phone: body.phone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
