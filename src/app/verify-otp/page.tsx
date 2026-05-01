"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyOTPPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const phoneParam = searchParams.get("phone") || "";
	const emailParam = searchParams.get("email") || "";

	const initialId = phoneParam || emailParam || "";

	const [identifier, setIdentifier] = useState(initialId);
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [devOtp, setDevOtp] = useState("");

	useEffect(() => {
		setIdentifier(initialId);
	}, [phoneParam, emailParam]);

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const payload: any = { otp };
			if (identifier.includes("@")) payload.email = identifier; else payload.phone = identifier;
			const res = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();
			if (res.ok) {
					setMessage("Verification successful! Redirecting...");
					setTimeout(() => router.push("/dashboard"), 1200);
			} else {
				setError(data.error || "Verification failed");
			}
		} catch (err) {
			setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		setLoading(true);
		setError("");
		try {
			const payload: any = {};
			if (identifier.includes("@")) payload.email = identifier; else payload.phone = identifier;
			const res = await fetch("/api/auth/resend-otp-sms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (res.ok) {
				setMessage("OTP resent");
				// Only display dev OTP in the UI when explicitly allowed via NEXT_PUBLIC_SHOW_DEV_OTP
				if (process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true" && data.otp) {
					setDevOtp(data.otp);
				}
			} else {
				setError(data.error || "Failed to resend OTP");
			}
		} catch (err) {
			setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="w-[350px] space-y-6">
				<h1 className="text-2xl font-bold text-center">Verify OTP</h1>

				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{message && (
					<Alert>
						<AlertDescription>{message}</AlertDescription>
					</Alert>
				)}

				{devOtp && (
					<div className="rounded-md bg-yellow-50 border border-yellow-200 p-2 text-center">
						<strong>Dev OTP:</strong> {devOtp}
					</div>
				)}

				<form onSubmit={handleVerify} className="space-y-4">
					<div>
						<Label>{identifier.includes("@") ? "Email" : "Phone"}</Label>
						<Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
					</div>

					<div>
						<Label>OTP</Label>
						<Input value={otp} onChange={(e) => setOtp(e.target.value)} required />
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Verifying..." : "Verify"}
					</Button>
				</form>

				<div className="text-center">
					<Button variant="ghost" onClick={handleResend} disabled={loading}>
						Resend OTP
					</Button>
				</div>
			</div>
		</div>
	);
}
