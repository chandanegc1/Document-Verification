import nodemailer from "nodemailer";

export const generateEmail = ({
  employeeName,
  employeeID,
  password,
  companyName,
  loginLink,
  hrName,
  hrEmail,
  hrContact,
}) => {
  return `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        
        <p>Dear <strong>${employeeName}</strong>,</p>

        <p>Welcome to <strong>${companyName}</strong>! We are delighted to have you join our team.</p>

        <p>As part of the onboarding process, we kindly request you to submit your documents for verification through our <strong>TrueDocs</strong> portal. Below are your login credentials:</p>

        <ul>
          <li><strong>Company Name:</strong> ${companyName}</li>
          <li><strong>Employee ID:</strong> ${employeeID}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>

        <p>Please log in using the following link:</p>
        <p><a href="${loginLink}" target="_blank">${loginLink}</a></p>

        <h3>Next Steps:</h3>
        <ul>
          <li>✅ Click on the link and enter your Employee ID and Password.</li>
          <li>✅ Upload all required documents for verification.</li>
          <li>✅ Ensure all files are clear and valid to prevent any delays.</li>
        </ul>

        <p>Should you require any assistance, please feel free to reach out to <strong>${hrName}</strong> at <a href="mailto:${hrEmail}">${hrEmail}</a> or contact <strong>${hrContact}</strong>.</p>

        <p>We look forward to working with you and wish you a successful journey with us.</p>

        <p><strong>Best Regards,</strong><br>
        ${hrName}<br>
        HR Team, ${companyName}</p>

        </body>
        </html> 
    `;
};

export async function sendEmailToEmployee(receiverEmail, emailContent, companyName) {
  try {
    if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
      throw new Error("Missing Nodemailer credentials. Please set NODEMAILER_USER and NODEMAILER_PASS.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: `"HR Team - ${companyName}" <${process.env.NODEMAILER_USER}>`,
      to: receiverEmail,
      subject: `Your TrueDocs Credentials for Document Submission – ${companyName}`,
      html: emailContent, // Using HTML instead of plain text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
}
