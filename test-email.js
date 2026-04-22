process.env.EMAIL_USER = "shubhamdalvi775@gmail.com";
process.env.EMAIL_PASS = "fnrgbbfxybrovywz";
const nodemailer = require('nodemailer');

async function testMail() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Maison Lumière" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Mail",
      text: "This is a test mail to check connection.",
    });
    console.log("Success! Message ID:", info.messageId);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
}

testMail();
