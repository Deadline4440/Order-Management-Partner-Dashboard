// Simple in-memory database for demo purposes
// In production, replace with MongoDB, PostgreSQL, or your preferred database

declare global {
  var usersDB: Map<string, User> | undefined;
  var otpDB: Map<string, OTPRecord> | undefined;
  var tempRegistrationsDB: Map<string, User> | undefined;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  verifiedAt?: Date;
}

interface OTPRecord {
  code: string;
  expiresAt: number;
  method: "sms" | "email";
  attempts: number;
}

// Module-level storage (persists across requests)
let usersDB = new Map<string, User>();
let otpDB = new Map<string, OTPRecord>();
let tempRegistrationsDB = new Map<string, User>();

// Also store in global for persistence
if (typeof global !== "undefined") {
  if (!global.usersDB) global.usersDB = usersDB;
  if (!global.otpDB) global.otpDB = otpDB;
  if (!global.tempRegistrationsDB) global.tempRegistrationsDB = tempRegistrationsDB;

  usersDB = global.usersDB;
  otpDB = global.otpDB;
  tempRegistrationsDB = global.tempRegistrationsDB;
}

// User operations
export const db = {
  // User operations
  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    const id = userData.email;
    const user: User = {
      ...userData,
      id,
    };
    usersDB.set(id, user);
    tempRegistrationsDB.delete(`temp_${userData.phone}`);
    return user;
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    return usersDB.get(email) || null;
  },

  // Normalize identifiers (phone numbers or emails) to a consistent key
  _normalizeIdentifier: (id: string) => {
    if (!id) return id;
    const s = id.trim();
    if (s.includes("@")) return s.toLowerCase();
    // phone: remove all non-digit characters
    const digits = s.replace(/\D/g, "");
    // If digits longer than 10 (country code present), assume last 10 digits are local number
    if (digits.length > 10) return digits.slice(-10);
    return digits;
  },

  getUserByPhone: async (phone: string): Promise<User | null> => {
    const norm = db._normalizeIdentifier(phone || "");
    for (const user of usersDB.values()) {
      const userPhoneNorm = db._normalizeIdentifier(user.phone || "");
      if (userPhoneNorm && userPhoneNorm === norm) return user;
    }
    return null;
  },

  getTempUserByPhone: async (phone: string): Promise<User | null> => {
    const norm = db._normalizeIdentifier(phone || "");
    return tempRegistrationsDB.get(`temp_${norm}`) || null;
  },

  saveTempUser: async (phone: string, userData: User): Promise<void> => {
    const norm = db._normalizeIdentifier(phone || "");
    tempRegistrationsDB.set(`temp_${norm}`, userData);
  },

  // OTP operations
  saveOTP: async (phone: string, otp: string, method: "sms" | "email"): Promise<void> => {
    const norm = db._normalizeIdentifier(phone || "");
    console.log("💾 Saving OTP:", { phone: norm, otp, method });
    otpDB.set(norm, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      method,
      attempts: 0,
    });
    console.log("✅ OTP Saved. Current OTPs in DB:", Array.from(otpDB.keys()));
  },

  getOTP: async (phone: string): Promise<OTPRecord | null> => {
    const norm = db._normalizeIdentifier(phone || "");
    const record = otpDB.get(norm);
    if (!record) return null;
    if (Date.now() > record.expiresAt) {
      otpDB.delete(norm);
      return null;
    }
    return record;
  },

  verifyOTP: async (phone: string, otp: string): Promise<boolean> => {
    const norm = db._normalizeIdentifier(phone || "");
    console.log("📱 Verifying OTP for:", norm);
    console.log("💾 Available OTPs in DB:", Array.from(otpDB.keys()));
    
    const record = await db.getOTP(norm);
    console.log("📋 OTP Record Found:", !!record);
    
    if (!record) {
      console.log("❌ No OTP record found for:", norm);
      return false;
    }
    
    console.log("🔍 Comparing:", { received: otp, stored: record.code, match: record.code === otp });
    
    if (record.code !== otp) {
      record.attempts++;
      console.log("❌ OTP mismatch. Attempts:", record.attempts);
      if (record.attempts >= 3) {
        otpDB.delete(norm);
        console.log("🔐 Too many attempts, OTP deleted");
        return false;
      }
      return false;
    }
    console.log("✅ OTP verified successfully");
    otpDB.delete(norm);
    return true;
  },

  deleteOTP: async (phone: string): Promise<void> => {
    const norm = db._normalizeIdentifier(phone || "");
    otpDB.delete(norm);
  },
};
