"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const phone = searchParams.get("phone") || "";
  const method = (searchParams.get("method") || "sms") as "sms" | "email";
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const verifyImage = PlaceHolderImages.find((p) => p.id === "login-hero");

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login or dashboard after 2 seconds
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 2000);
      } else {
        setError(data.error || "OTP verification failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      // Call resend OTP API
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          method,
        }),
      });

      if (response.ok) {
        setTimeLeft(600); // Reset timer
        setOtp("");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Invalid request. Please register again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={58}
              height={58}
              className="h-12 w-12 mx-auto"
              style={{ color: "#000" }}
            />
            <h1 className="text-3xl font-bold font-headline">Verify OTP</h1>
            <p className="text-balance text-muted-foreground text-sm">
              {method === "sms"
                ? `Enter the OTP sent to ${phone}`
                : `Enter the OTP sent to ${email}`}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ OTP verified successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerifyOTP} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                className="text-center text-2xl tracking-widest font-mono"
                disabled={success}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                OTP expires in{" "}
                <span className="font-semibold text-accent">
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={loading || success || timeLeft <= 0}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <div className="grid gap-3">
            <div className="text-center text-sm">
              Didn't receive OTP?{" "}
              <button
                onClick={handleResendOTP}
                disabled={loading || timeLeft > 300} // Can resend after 5 minutes
                className="underline text-accent hover:text-accent/90 disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
            </div>

            <Link href="/register" className="text-center text-sm text-muted-foreground hover:underline">
              Change phone number
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {verifyImage && (
          <Image
            src={verifyImage.imageUrl}
            alt="Warehouse"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.4]"
            data-ai-hint={verifyImage.imageHint}
          />
        )}
      </div>
    </div>
  );
}
