"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function RegisterPage() {
  const [step, setStep] = useState<"details" | "otp-method">("details");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otpMethod: "sms",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const registerImage = PlaceHolderImages.find((p) => p.id === "login-hero");

  const validateDetailsStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetailsStep()) {
      setStep("otp-method");
    }
  };

  const handleOtpMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          otpMethod: formData.otpMethod,
        }),
      });

      if (response.ok) {
        // Redirect to OTP verification page with all required parameters
        const params = new URLSearchParams({
          phone: formData.phone,
          email: formData.email,
          method: formData.otpMethod,
        });
        window.location.href = `/verify-otp?${params.toString()}`;
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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
            <h1 className="text-3xl font-bold font-headline">Partner Register</h1>
            <p className="text-balance text-muted-foreground text-sm">
              {step === "details"
                ? "Create your partner account"
                : "Choose how to verify your account"}
            </p>
          </div>

          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {step === "details" ? (
            <form onSubmit={handleDetailsSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 97210857894"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90"
              >
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpMethodSubmit} className="grid gap-6">
              <Card className="p-4">
                <Label className="text-base font-semibold mb-4 block">
                  Select OTP Delivery Method
                </Label>
                <RadioGroup
                  value={formData.otpMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      otpMethod: value,
                    }))
                  }
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg mb-3 hover:bg-accent/5 cursor-pointer">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms" className="flex-1 cursor-pointer">
                      <div className="font-semibold">SMS</div>
                      <div className="text-sm text-muted-foreground">
                        Receive OTP via SMS to {formData.phone}
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/5 cursor-pointer">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Email</div>
                      <div className="text-sm text-muted-foreground">
                        Receive OTP via Email to {formData.email}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("details")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {registerImage && (
          <Image
            src={registerImage.imageUrl}
            alt="Warehouse"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.4]"
            data-ai-hint={registerImage.imageHint}
          />
        )}
      </div>
    </div>
  );
}
