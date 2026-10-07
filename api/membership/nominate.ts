import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { buildRegistryEmailHtml } from "../_lib/emailTemplate.js";

const NOMINATION_RECIPIENT = "membership@cbbcl.org";
const NOMINATION_SENDER = "notifications@cbbcl.org";

// Applicant photo arrives as a data URL (resized in the browser). Only JPEG/PNG/WebP, max 3 MB.
const PHOTO_MAX_BYTES = 3 * 1024 * 1024;
function parseApplicantPhoto(dataUrl: unknown): { content: string; contentType: string; ext: string } | null {
  if (typeof dataUrl !== "string") return null;
  const m = dataUrl.match(/^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return null;
  const content = m[3];
  if (Math.floor((content.length * 3) / 4) > PHOTO_MAX_BYTES) return null;
  return { content, contentType: m[1], ext: m[2] === "jpeg" ? "jpg" : m[2] };
}

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

    if (!fullName || !email || !phone || !facebookLink) {
      return res.status(400).json({ error: "Full name, email, phone, and Facebook link are required." });
    }

    const photo = parseApplicantPhoto(body.photo);
    if (!photo) {
      return res.status(400).json({ error: "Please attach a photo (JPG, PNG or WebP, up to 3 MB)." });
    }
    const photoFilename = `${fullName.replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "").toLowerCase() || "applicant"}-photo.${photo.ext}`;

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
      `LinkedIn Profile: ${linkedinLink || "Not provided"}`,
      `Website: ${websiteLink || "Not provided"}`,
      `Proposer Code: ${proposerCode || "Under Committee Review"}`,
      `Seconder Code: ${seconderCode || "Under Committee Review"}`,
    ];

    const fields = [
      { label: "Candidate Full Name", value: fullName },
      { label: "Email", value: email },
      { label: "Category Preferred", value: category || "Not specified" },
      { label: "Date of Birth", value: dob || "Not specified" },
      { label: "Organization", value: org || "Not specified" },
      { label: "Designation", value: designation || "Not specified" },
      { label: "Telephone/Phone", value: phone },
      { label: "Facebook Profile", value: facebookLink, isLink: true },
      { label: "LinkedIn Profile", value: linkedinLink || "Not provided", isLink: !!linkedinLink },
      { label: "Website", value: websiteLink || "Not provided", isLink: !!websiteLink },
      { label: "Proposer Code", value: proposerCode || "Under Committee Review" },
      { label: "Seconder Code", value: seconderCode || "Under Committee Review" },
    ];

    const html = buildRegistryEmailHtml(
      "Membership Nomination Request",
      "A new membership nomination request has been submitted through the CBBCL Registry Portal.",
      fields,
      undefined,
      "applicant-photo"
    );

    const { error } = await resend.emails.send({
      from: `CBBCL Registry <${NOMINATION_SENDER}>`,
      to: NOMINATION_RECIPIENT,
      replyTo: email,
      attachments: [
        // Inline copy shown in the email body, plus a regular attachment to download.
        { filename: photoFilename, content: photo.content, contentType: photo.contentType, contentId: "applicant-photo" },
        { filename: photoFilename, content: photo.content, contentType: photo.contentType }
      ],
      subject: `Membership Nomination Request - ${fullName}`,
      text: lines.join("\n"),
      html,
    });

    if (error) {
      console.error("Error sending nomination email: ", error);
      return res.status(500).json({ error: "Failed to send nomination request: " + error.message });
    }

    // Send the candidate a copy of their own submission for their records
    try {
      const confirmationHtml = buildRegistryEmailHtml(
        "Your Nomination Request Has Been Received",
        `Dear ${fullName}, thank you for submitting your membership nomination request to Cox's Bazar Boat Club Ltd. Here is a copy of the details you submitted.`,
        fields,
        "This is a system-generated automatic message. Someone from the Cox's Bazar Boat Club Ltd. Secretariat will be in touch with you shortly for further evaluation. In the meantime, you may reach us directly at membership@cbbcl.org."
      );
      await resend.emails.send({
        from: `CBBCL Registry <${NOMINATION_SENDER}>`,
        to: email,
        replyTo: NOMINATION_RECIPIENT,
        subject: "Your Membership Nomination Request Has Been Received - CBBCL",
        text: `${lines.join("\n")}\n\nThis is a system-generated automatic message. Someone from the Cox's Bazar Boat Club Ltd. Secretariat will be in touch with you shortly for further evaluation. In the meantime, you may reach us directly at membership@cbbcl.org.`,
        html: confirmationHtml,
      });
    } catch (copyError) {
      console.error("Error sending nomination confirmation copy to candidate: ", copyError);
    }

    res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error sending nomination email: ", error);
    res.status(500).json({ error: "Failed to send nomination request: " + error.message });
  }
}
