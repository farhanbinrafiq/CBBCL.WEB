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
    const fullName = (body.fullName || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || "").toString().trim();
    const category = (body.category || "").toString().trim();
    const org = (body.org || "").toString().trim();
    const designation = (body.designation || "").toString().trim();
    const dob = (body.dob || "").toString().trim();
    const proposerCode = (body.proposerCode || "").toString().trim();
    const seconderCode = (body.seconderCode || "").toString().trim();
    const facebookLink = (body.facebookLink || "").toString().trim();
    const linkedinLink = (body.linkedinLink || "").toString().trim();
    const websiteLink = (body.websiteLink || "").toString().trim();

    if (!fullName || !email || !phone || !facebookLink || !linkedinLink) {
      return res.status(400).json({ error: "Full name, email, phone, Facebook link, and LinkedIn link are required." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Nomination email not sent: RESEND_API_KEY not configured.");
      return res.status(500).json({ error: "Email service is not configured on the server." });
    }
    const resend = new Resend(apiKey);

    const lines = [
      `Candidate Full Name: ${fullName}`,
      `Email: ${email}`,
      `Category Preferred: ${category || "Not specified"}`,
      `Date of Birth: ${dob || "Not specified"}`,
      `Organization: ${org || "Not specified"}`,
      `Designation: ${designation || "Not specified"}`,
      `Telephone/Phone: ${phone}`,
      `Facebook Profile: ${facebookLink}`,
      `LinkedIn Profile: ${linkedinLink}`,
      `Website: ${websiteLink || "Not provided"}`,
      `Proposer Code: ${proposerCode || "Under Committee Review"}`,
      `Seconder Code: ${seconderCode || "Under Committee Review"}`,
    ];

    const { error } = await resend.emails.send({
      from: `CBBCL Registry <${NOMINATION_SENDER}>`,
      to: NOMINATION_RECIPIENT,
      replyTo: email,
      subject: `Membership Nomination Request - ${fullName}`,
      text: lines.join("\n"),
      html: `<p>${lines.join("<br/>")}</p>`,
    });

    if (error) {
      console.error("Error sending nomination email: ", error);
      return res.status(500).json({ error: "Failed to send nomination request: " + error.message });
    }

    res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error sending nomination email: ", error);
    res.status(500).json({ error: "Failed to send nomination request: " + error.message });
  }
}
