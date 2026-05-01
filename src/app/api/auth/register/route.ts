import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpSMS } from "@/lib/send-sms";
import { sendOtpEmail } from "@/lib/send-email";

export async function POST(req: Request) {
  try {
    const { name, phone, email, method } = await req.json();

    if (!name || (!phone && !email)) {
      return NextResponse.json({ error: "Name and phone or email are required" }, { status: 400 });
    }

    const identifier = phone || email; // use phone if present else email

    const tempUser = {
      id: `temp_${identifier}`,
      firstName: name,
      lastName: "",
      email: email || (phone ? `${phone}@mobile.local` : ``),
      phone: phone || "",
      password: "",
      verified: false,
      createdAt: new Date(),
    };

    await db.saveTempUser(identifier, tempUser as any);

    // Development shortcut: create user immediately and return token
    // Only enable this shortcut when DEV_SKIP_OTP=true (defaults to false).
    if (process.env.NODE_ENV === "development" && (process.env.DEV_SKIP_OTP || "").toLowerCase() === "true") {
      const created = await db.createUser({
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        email: tempUser.email,
        phone: tempUser.phone,
        password: tempUser.password,
        verified: true,
        createdAt: tempUser.createdAt,
      } as any);
      try {
        const { generateToken } = await import("@/lib/jwt");
        const token = await generateToken(created.id, created.email);
        const response = NextResponse.json({ message: "Registered (dev)", user: { id: created.id, phone: created.phone }, token }, { status: 200 });
        response.cookies.set("auth-token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      } catch (e) {
        return NextResponse.json({ message: "Registered (dev)", user: { id: created.id, phone: created.phone } }, { status: 200 });
      }
    }

    // Generate OTP and save
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.saveOTP(identifier, otp, email ? "email" : "sms");

    // Send OTP via chosen method or default
    if (email || method === "email") {
      try {
        await sendOtpEmail(email || tempUser.email, otp);
        console.log("[REGISTER] Temp user saved and OTP emailed", { identifier, otp });
      } catch (e) {
        console.error("Failed to send email OTP:", e);
      }
    } else {
      const phoneWithCountry = phone && phone.startsWith("+") ? phone : `+91${phone}`;
      try {
        await sendOtpSMS(phoneWithCountry, otp);
        console.log("[REGISTER] Temp user saved and OTP sent via SMS", { identifier, otp });
      } catch (e) {
        console.error("Failed to send SMS OTP:", e);
      }
    }

    const resp: any = { message: "OTP sent", identifier };
    if (process.env.SHOW_DEV_OTP === "true") resp.otp = otp;
    console.log("[DEV OTP]", { identifier, otp });
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
