import twilio from "twilio";

const rawAccountSid = process.env.TWILIO_ACCOUNT_SID;
// Normalize possible surrounding quotes/whitespace when env gets pasted
const accountSid = typeof rawAccountSid === "string" ? rawAccountSid.replace(/^["'\s]+|["'\s]+$/g, "").trim() : rawAccountSid;
const authToken = typeof process.env.TWILIO_AUTH_TOKEN === "string" ? process.env.TWILIO_AUTH_TOKEN.trim() : process.env.TWILIO_AUTH_TOKEN;
const fromNumber = typeof process.env.TWILIO_PHONE_NUMBER === "string" ? process.env.TWILIO_PHONE_NUMBER.trim() : process.env.TWILIO_PHONE_NUMBER;

const hasCredentials = Boolean(accountSid && authToken && fromNumber);
const isValidAccountSid = typeof accountSid === "string" && accountSid.startsWith("AC");
const forceTwilio = (process.env.TWILIO_FORCE || "").toLowerCase() === "true" || (process.env.TWILIO_FORCE || "") === "1";

if (!hasCredentials) {
  console.warn("⚠️ Twilio credentials not configured. SMS sending disabled.");
} else if (!isValidAccountSid && !forceTwilio) {
  console.warn("⚠️ TWILIO_ACCOUNT_SID looks invalid after normalization. It should start with 'AC'. SMS sending disabled.");
} else if (!isValidAccountSid && forceTwilio) {
  console.warn("⚠️ TWILIO_ACCOUNT_SID does not start with 'AC', but TWILIO_FORCE=true so Twilio client will be initialized for testing.");
}

const client = hasCredentials && (isValidAccountSid || forceTwilio) ? twilio(accountSid as string, authToken as string) : null;

export async function sendOtpSMS(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 [SMS] OTP for ${phoneNumber}: ${otp}`);
      return true;
    }

    if (!client) {
      console.error("❌ Twilio client not initialized. Check environment variables.");
      return false;
    }

    const message = await client.messages.create({
      body: `Your OTP is: ${otp}\n\nValid for 10 minutes. Do not share this code.`,
      from: fromNumber,
      to: phoneNumber, // Should include country code, e.g., +919876543210
    });

    console.log(`✅ SMS sent to ${phoneNumber} (SID: ${message.sid})`);
    return true;
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    return false;
  }
}
