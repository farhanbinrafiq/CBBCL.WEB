// Shared branded HTML email template for registry notification emails
// (membership nomination requests, contact inquiries).
// Kept inside api/ (rather than imported from src/) so Vercel's serverless
// function bundler always resolves it correctly.

export interface EmailField {
  label: string;
  value: string;
  isLink?: boolean;
}

export function buildRegistryEmailHtml(heading: string, intro: string, fields: EmailField[], closingNote?: string): string {
  const rows = fields
    .map(
      (f) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee6d3;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#9a9488;font-weight:700;margin-bottom:4px;">
              ${f.label}
            </div>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a2744;font-weight:600;word-break:break-word;">
              ${f.isLink ? `<a href="${f.value}" style="color:#a8873a;text-decoration:none;">${f.value}</a>` : f.value}
            </div>
          </td>
        </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f2ec;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2ec;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(26,39,68,0.08);">
            <tr>
              <td style="background-color:#1a2744;padding:32px 40px;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;font-weight:700;">
                  Cox's Bazar Boat Club Ltd.
                </div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#ffffff;font-weight:300;margin-top:8px;letter-spacing:0.3px;">
                  ${heading}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 8px 40px;">
                <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555;line-height:1.6;margin:0 0 8px 0;">
                  ${intro}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
              </td>
            </tr>
            ${
              closingNote
                ? `<tr>
              <td style="padding:0 40px 28px 40px;">
                <div style="background-color:#fbf6e9;border:1px solid #eee6d3;border-left:3px solid #c9a84c;border-radius:2px;padding:16px 18px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#a8873a;font-weight:700;margin-bottom:6px;">
                    Automated Notice
                  </div>
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:12.5px;color:#4a4636;line-height:1.6;">
                    ${closingNote}
                  </div>
                </div>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="background-color:#faf8f2;padding:20px 40px;text-align:center;border-top:1px solid #eee6d3;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#9a9488;letter-spacing:0.5px;">
                  This is an automated notification from the CBBCL Registry Portal.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
