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

  getUserByPhone: async (phone: string): Promise<User | null> => {
    for (const user of usersDB.values()) {
      if (user.phone === phone) return user;
    }
    return null;
  },

  getTempUserByPhone: async (phone: string): Promise<User | null> => {
    return tempRegistrationsDB.get(`temp_${phone}`) || null;
  },

  saveTempUser: async (phone: string, userData: User): Promise<void> => {
    tempRegistrationsDB.set(`temp_${phone}`, userData);
  },

  // OTP operations
  saveOTP: async (phone: string, otp: string, method: "sms" | "email"): Promise<void> => {
    console.log("💾 Saving OTP:", { phone, otp, method });
    otpDB.set(phone, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      method,
      attempts: 0,
    });
    console.log("✅ OTP Saved. Current OTPs in DB:", Array.from(otpDB.keys()));
  },

  getOTP: async (phone: string): Promise<OTPRecord | null> => {
    const record = otpDB.get(phone);
    if (!record) return null;
    if (Date.now() > record.expiresAt) {
      otpDB.delete(phone);
      return null;
    }
    return record;
  },

  verifyOTP: async (phone: string, otp: string): Promise<boolean> => {
    console.log("📱 Verifying OTP for phone:", phone);
    console.log("💾 Available OTPs in DB:", Array.from(otpDB.keys()));
    
    const record = await db.getOTP(phone);
    console.log("📋 OTP Record Found:", !!record);
    
    if (!record) {
      console.log("❌ No OTP record found for:", phone);
      return false;
    }
    
    console.log("🔍 Comparing:", { received: otp, stored: record.code, match: record.code === otp });
    
    if (record.code !== otp) {
      record.attempts++;
      console.log("❌ OTP mismatch. Attempts:", record.attempts);
      if (record.attempts >= 3) {
        otpDB.delete(phone);
        console.log("🔐 Too many attempts, OTP deleted");
        return false;
      }
      return false;
    }
    console.log("✅ OTP verified successfully");
    otpDB.delete(phone);
    return true;
  },

  deleteOTP: async (phone: string): Promise<void> => {
    otpDB.delete(phone);
  },
};
