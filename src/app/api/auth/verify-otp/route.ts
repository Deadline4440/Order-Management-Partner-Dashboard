import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
	try {
		const { phone, email, otp } = await req.json();
		const identifier = phone || email;

		if (!identifier || !otp) {
			return NextResponse.json({ error: "Identifier and OTP are required" }, { status: 400 });
		}

		const isValid = await db.verifyOTP(identifier, otp);

		if (!isValid) {
			return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
		}

		// Get temp user and create final user
		let temp = await db.getTempUserByPhone(identifier);
		if (!temp) {
			// Fallback: check if a full user already exists (dev shortcut or previous registration)
			const possibleUser = identifier.includes("@") ? await db.getUserByEmail(identifier) : await db.getUserByPhone(identifier);
			if (possibleUser) {
				// If user exists and already verified, return success
				if (possibleUser.verified) {
					return NextResponse.json({ message: "Verification successful", user: { id: possibleUser.id, firstName: possibleUser.firstName, phone: possibleUser.phone } }, { status: 200 });
				}
				// Mark existing user as verified
				possibleUser.verified = true;
				possibleUser.verifiedAt = new Date();
				temp = possibleUser as any;
			} else {
				return NextResponse.json({ error: "Temporary registration not found" }, { status: 404 });
			}
		}

		const userPayload = {
			firstName: temp.firstName,
			lastName: temp.lastName || "",
			email: temp.email || (identifier.includes("@") ? identifier : `${identifier}@mobile.local`),
			phone: temp.phone || (identifier.includes("@") ? "" : identifier),
			password: temp.password || "",
			verified: true,
			createdAt: temp.createdAt || new Date(),
			verifiedAt: new Date(),
		};

				const created = await db.createUser(userPayload as any);

				try {
					const token = await generateToken(created.id, created.email);
					const resp = NextResponse.json({ message: "Verification successful", user: { id: created.id, firstName: created.firstName, phone: created.phone } }, { status: 200 });
					resp.cookies.set("auth-token", token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						maxAge: 60 * 60 * 24 * 7,
					});
					return resp;
				} catch (e) {
					console.error("Failed to generate token:", e);
					return NextResponse.json({ message: "Verification successful", user: { id: created.id, firstName: created.firstName, phone: created.phone } }, { status: 200 });
				}
	} catch (error) {
		console.error("Verify OTP error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

