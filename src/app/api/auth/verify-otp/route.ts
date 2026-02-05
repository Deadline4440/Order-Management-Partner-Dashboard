import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";
import { generateToken } from "@/lib/jwt";

interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export async function POST() {
  try {
    const body: VerifyOTPRequest = await request.json();

    console.log("🔐 Verify OTP Request:", { phone: body.phone, otpLength: body.otp?.length });

    if (!body.phone || !body.otp) {
      console.log("❌ Missing phone or otp");
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValidOTP = await db.verifyOTP(body.phone, body.otp);

    console.log("🔐 OTP Verification Result:", { isValidOTP });

    if (!isValidOTP) {
      console.log("❌ Invalid OTP");
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Get temporary user data
    const tempUser = await db.getTempUserByPhone(body.phone);

    if (!tempUser) {
      return NextResponse.json(
        { error: "User registration data not found" },
        { status: 404 }
      );
    }

    // Create permanent user record
    const verifiedUser = await db.createUser({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      email: tempUser.email,
      phone: tempUser.phone,
      password: tempUser.password,
      verified: true,
      createdAt: tempUser.createdAt,
      verifiedAt: new Date(),
    });

    // Generate JWT token
    const token = await generateToken(verifiedUser.id, verifiedUser.email);

    // Send welcome email
    await sendWelcomeEmail(verifiedUser.email, verifiedUser.firstName);

    // Create response with cookie
    const response = NextResponse.json(
      {
        message: "OTP verified successfully",
        user: {
          id: verifiedUser.id,
          firstName: verifiedUser.firstName,
          lastName: verifiedUser.lastName,
          email: verifiedUser.email,
          phone: verifiedUser.phone,
          verified: true,
        },
        token,
      },
      { status: 200 }
    );

    // Set secure cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
