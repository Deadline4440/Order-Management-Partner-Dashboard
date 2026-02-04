import nodemailer from "nodemailer";

export async function sendOtpEmail(to: string, otp: string) {
  console.log("[EMAIL] Sending OTP", otp, "to", to);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify config (debug help)
  await transporter.verify();

  await transporter.sendMail({
    from: `"UCW Login" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Verify your Email</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  });
}
