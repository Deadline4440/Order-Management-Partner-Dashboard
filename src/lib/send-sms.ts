import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const hasCredentials = Boolean(accountSid && authToken && fromNumber);
const isValidAccountSid = typeof accountSid === "string" && accountSid.startsWith("AC");

if (!hasCredentials) {
  console.warn("⚠️ Twilio credentials not configured. SMS sending disabled.");
} else if (!isValidAccountSid) {
  console.warn("⚠️ TWILIO_ACCOUNT_SID looks invalid. It should start with 'AC'. SMS sending disabled.");
}

const client = hasCredentials && isValidAccountSid ? twilio(accountSid as string, authToken as string) : null;

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
