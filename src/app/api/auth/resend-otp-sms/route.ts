import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpSMS } from "@/lib/send-sms";
import { sendOtpEmail } from "@/lib/send-email";

export async function POST(req: Request) {
  try {
    const { phone, email, method } = await req.json();

    const identifier = phone || email;
    if (!identifier) {
      return NextResponse.json({ error: "Phone or email is required" }, { status: 400 });
    }

    // Check temp registration exists
    let temp = await db.getTempUserByPhone(identifier);
    // If no temp registration, check if a full user exists (useful in dev shortcut)
    if (!temp) {
      const possibleUser = identifier.includes("@") ? await db.getUserByEmail(identifier) : await db.getUserByPhone(identifier);
      if (possibleUser) {
        // create a temp-like object to reuse email/phone
        temp = possibleUser as any;
      } else {
        return NextResponse.json({ error: "No registration found for this identifier" }, { status: 404 });
      }
    }

    // Generate and save new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const usedMethod = method || (email ? "email" : "sms");
    await db.saveOTP(identifier, otp, usedMethod as any);

    if (usedMethod === "email") {
      try {
        await sendOtpEmail(temp.email || email, otp);
        console.log("[RESEND OTP] Emailed OTP to", identifier);
      } catch (e) {
        console.error("Failed to resend email OTP:", e);
      }
    } else {
      const phoneWithCountry = identifier.startsWith("+") ? identifier : `+91${identifier}`;
      try {
        await sendOtpSMS(phoneWithCountry, otp);
        console.log("[RESEND OTP] Sent SMS OTP to", identifier);
      } catch (e) {
        console.error("Failed to resend SMS OTP:", e);
      }
    }

    const resp: any = { message: "OTP resent" };
    // Only include OTP in response when explicitly enabled (useful for automated tests).
    if (process.env.SHOW_DEV_OTP === "true") {
      resp.otp = otp;
    }
    // Always log the OTP server-side for development troubleshooting (does not expose it to clients by default)
    console.log("[DEV OTP]", { identifier, otp });
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
