import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const updateData = await request.json();

    // If rescheduling, check availability
    if (updateData.date && updateData.time) {
      const existing = await Booking.findOne({
        _id: { $ne: id },
        date: updateData.date,
        time: updateData.time,
        status: { $in: ["Pending", "Confirmed"] },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Time slot is already booked" },
          { status: 400 }
        );
      }
    }

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    // Check if status changed to 'Confirmed'
    if (updateData.status === "Confirmed") {
      try {
        // 1. Send Email Notification
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const nodemailer = require("nodemailer");

          const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const emailTemplate = `
            <div style="margin:0;padding:0;background-color:#f8f5f1;font-family:Arial,sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f5f1;padding:30px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
                      
                      <tr>
                        <td style="background:#111827;padding:30px;text-align:center;">
                          <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">Deepali Makeup Artist</h1>
                          <p style="margin:8px 0 0;color:#e5e7eb;font-size:14px;">Booking Confirmation</p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:35px 30px;">
                          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hello ${booking.name},</p>

                          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#374151;">
                            Great news! Your booking has been
                            <strong style="color:#059669;">confirmed</strong>.
                          </p>

                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                            <tr>
                              <td style="padding:20px;">
                                <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Service</p>
                                <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:bold;">${booking.service}</p>

                                <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Date</p>
                                <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:bold;">${booking.date}</p>

                                <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Time</p>
                                <p style="margin:0;font-size:16px;color:#111827;font-weight:bold;">${booking.time}</p>
                              </td>
                            </tr>
                          </table>

                          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#374151;">
                            We look forward to welcoming you at the atelier.
                          </p>

                          <p style="margin:30px 0 0;font-size:15px;color:#111827;">
                            Best regards,<br />
                            <strong>Deepali Makeup Artist</strong>
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:20px 30px;background:#f3f4f6;text-align:center;">
                          <p style="margin:0;font-size:12px;color:#6b7280;">
                            This is an automated booking confirmation email.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </div>
          `;

          await transporter.sendMail({
            from: `"Deepali Makeup Artist" <${process.env.EMAIL_USER}>`,
            to: booking.email,
            subject: "Your Booking is Confirmed!",
            text: `Hello ${booking.name},\n\nGreat news! Your booking for ${booking.service} on ${booking.date} at ${booking.time} has been officially Confirmed.\n\nLooking forward to seeing you at the atelier!\n\nBest,\nDeepali Makeup Artist`,
            html: emailTemplate,
          });
        }
      } catch (notifyErr) {
        console.error("Failed to send booking confirmation notifications", notifyErr);
      }
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}