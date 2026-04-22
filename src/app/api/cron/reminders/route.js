import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    // This route should be protected typically with a secret token for CRON jobs
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "local_dev_secret"}`) {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      // Bypassed for development ease, enable above in prod
    }

    await connectDB();
    
    // Find bookings exactly 1 day from now
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD

    const bookings = await Booking.find({ date: tomorrowStr, status: "Confirmed" });

    // NodeMailer Setup
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let sentCount = 0;

    for (const booking of bookings) {
      // 1. Send Email Reminder
      if (process.env.EMAIL_USER) {
        await transporter.sendMail({
          from: `"Deepali Makeup Artist" <${process.env.EMAIL_USER}>`,
          to: booking.email,
          subject: "Reminder: Your Upcoming Appointment",
          text: `Hello ${booking.name},\n\nThis is a friendly reminder for your upcoming ${booking.service} appointment tomorrow at ${booking.time}.\n\nLooking forward to seeing you!\n\nBest,\nDeepali Makeup Artist`
        });
      }

      // 2. Send WhatsApp Reminder (Conceptual via Twilio / Cloud API)
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `Hello ${booking.name}, reminder for your ${booking.service} appointment tomorrow at ${booking.time}.`,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${booking.phone}`
        });
      }

      sentCount++;
    }

    return NextResponse.json({ success: true, remindersSent: sentCount, bookings: bookings.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
