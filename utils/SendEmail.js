import nodemailer from "nodemailer";

console.log("SendEmail.js has been loaded by Node");

export async function sendEmail(to, subject, html) {
  console.log("sendEmail() called with:", to);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent to", to);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
}
