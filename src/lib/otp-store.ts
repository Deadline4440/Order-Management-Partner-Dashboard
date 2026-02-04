// src/lib/otp-store.ts
export const otpStore = new Map<
  string,
  { otp: string; expiresAt: number }
>();
