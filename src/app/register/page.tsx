"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { normalizePhone } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"sms" | "email">("sms");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const phoneToSend = normalizePhone(phone);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone: phoneToSend || undefined, email: email || undefined, method }),
      });

      const data = await response.json();

      if (response.ok) {
        // show dev otp only when explicitly allowed
        if (process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true" && data.otp) {
          setDevOtp(data.otp);
        }

        setMessage("OTP sent. Redirecting to verification...");
        setTimeout(() => {
          const identifier = phoneToSend || email;
          if (phoneToSend) router.push(`/verify-otp?phone=${encodeURIComponent(phoneToSend)}`);
          else router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 800);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[380px] space-y-6 rounded-lg border p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Create your partner account</h1>
        <p className="text-center text-sm text-muted-foreground">Enter your name and either phone or email to receive a verification code.</p>

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

        {devOtp && process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true" && (
          <div className="rounded-md bg-yellow-50 border border-yellow-200 p-2 text-center">
            <strong>Dev OTP:</strong> {devOtp}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant={method === 'sms' ? 'secondary' : 'outline'} onClick={() => setMethod('sms')}>Use SMS</Button>
            <Button variant={method === 'email' ? 'secondary' : 'outline'} onClick={() => setMethod('email')}>Use Email</Button>
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={method === 'sms'}
              placeholder="e.g. 9000000000"
            />
          </div>

          <div>
            <Label>Email (optional)</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={method === 'email'}
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending code..." : "Send verification code"}
          </Button>
        </form>
      </div>
    </div>
  );
}
