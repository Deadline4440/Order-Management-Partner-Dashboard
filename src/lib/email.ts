import nodemailer from "nodemailer";

// Email transporter configuration
// For production, use environment variables with real SMTP service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password",
  },
});

export async function sendOTPEmail(
  email: string,
  otp: string,
  userName?: string
): Promise<boolean> {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === "development") {
      console.log(`📧 [EMAIL] OTP for ${email}: ${otp}`);
      return true;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@ucwproject.com",
      to: email,
      subject: "Your OTP for Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Partner Portal!</h2>
          <p>Hi ${userName || "Partner"},</p>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <h1 style="background: #f0f0f0; padding: 20px; text-align: center; color: #007bff; font-kerning: auto; letter-spacing: 5px;">
            ${otp}
          </h1>
          <p style="color: #666;">This OTP is valid for 10 minutes only.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}

export async function sendSMSOTP(
  phone: string,
  otp: string
): Promise<boolean> {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 [SMS] OTP for ${phone}: ${otp}`);
      return true;
    }

    // TODO: Implement SMS service (Twilio, AWS SNS, etc.)
    // Example with Twilio:
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your OTP is: ${otp}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // });

    console.log(`✅ SMS OTP sent to ${phone}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    return false;
  }
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<boolean> {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`📧 [EMAIL] Welcome email sent to ${email}`);
      return true;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@ucwproject.com",
      to: email,
      subject: "Welcome to Partner Portal!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome, ${firstName}!</h2>
          <p>Your account has been successfully verified and activated.</p>
          <p>You can now log in to your partner portal and start managing your orders.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" 
             style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Go to Login
          </a>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return false;
  }
}
