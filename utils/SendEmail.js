import axios from "axios";

export async function sendEmail(to, subject, html) {
  console.log("sendEmail() called for:", to);

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "reactors.project@gmail.com",
          name: "Reactors App",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Brevo email sent:", response.data);
    return true;
  } catch (error) {
    console.error("Brevo Email Error:", error.response?.data || error.message);
    return false;
  }
}
