import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const NOMINATION_RECIPIENT = "registration@cbbcl.org";
const NOMINATION_SENDER = "notifications@cbbcl.org";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = req.body || {};
    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || "").toString().trim();
    const subject = (body.subject || "").toString().trim();
    const message = (body.message || "").toString().trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Contact inquiry email not sent: RESEND_API_KEY not configured.");
      return res.status(500).json({ error: "Email service is not configured on the server." });
    }
    const resend = new Resend(apiKey);

    const lines = [
      `Full Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Inquiry Sphere: ${subject || "Not specified"}`,
      `Message: ${message}`,
    ];

    const { error } = await resend.emails.send({
      from: `CBBCL Registry <${NOMINATION_SENDER}>`,
      to: NOMINATION_RECIPIENT,
      replyTo: email,
      subject: `Contact Registry Inquiry - ${name}`,
      text: lines.join("\n"),
      html: `<p>${lines.join("<br/>")}</p>`,
    });

    if (error) {
      console.error("Error sending contact inquiry email: ", error);
      return res.status(500).json({ error: "Failed to send your inquiry: " + error.message });
    }

    res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error sending contact inquiry email: ", error);
    res.status(500).json({ error: "Failed to send your inquiry: " + error.message });
  }
}
