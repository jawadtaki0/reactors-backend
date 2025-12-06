import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, html) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Reactors <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw error;
    }

    console.log("Resend email sent:", data?.id || "");
  } catch (err) {
    console.error("Error sending email via Resend:", err);
    throw err;
  }
}
