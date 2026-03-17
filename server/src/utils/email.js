import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"CampusRide" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset OTP — CampusRide',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #2563eb;">CampusRide</h2>
        <p>Your password reset OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #111;">${otp}</h1>
        <p style="color: #666;">This OTP expires in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

export const sendBookingConfirmationEmail = async (to, booking) => {
  await transporter.sendMail({
    from: `"CampusRide" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Booking Confirmed — CampusRide',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Booking Confirmed!</h2>
        <p>Your booking for <strong>${booking.bikeName}</strong> has been confirmed.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; color: #666;">Dates</td>
            <td style="padding: 8px; font-weight: bold;">${booking.startDate} → ${booking.endDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #666;">Total cost</td>
            <td style="padding: 8px; font-weight: bold;">₹${booking.totalCost}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #666;">Owner contact</td>
            <td style="padding: 8px; font-weight: bold;">${booking.ownerPhone}</td>
          </tr>
        </table>
        <p style="color: #666;">Thank you for using CampusRide!</p>
      </div>
    `,
  });
};