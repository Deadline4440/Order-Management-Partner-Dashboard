import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";
import { sendOtpEmail } from "@/lib/send-email";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(email, { otp, expiresAt });

  await sendOtpEmail(email, otp);

  console.log(`[EMAIL] Resending OTP ${otp} to ${email}`);

  return NextResponse.json({ success: true });
}
