const mail = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transport = mail.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, htmlContent) {
  try {
    const info = await transport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.error("Email send error:", err);
  }
}

module.exports = sendMail
