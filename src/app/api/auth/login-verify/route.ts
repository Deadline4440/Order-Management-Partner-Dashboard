import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/jwt";

interface VerifyLoginOTPRequest {
  phone: string;
  otp: string;
}

export async function POST() { {
  try {
    const body: VerifyLoginOTPRequest = await request.json();

    if (!body.phone || !body.otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValidOTP = await db.verifyOTP(body.phone, body.otp);

    if (!isValidOTP) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Get user data
    const user = await db.getUserByPhone(body.phone);

    if (!user || !user.verified) {
      return NextResponse.json(
        { error: "User not found or not verified" },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = await generateToken(user.id, user.email);

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
