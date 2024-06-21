import nodemailer from 'nodemailer'; // Import nodemailer package
import dotenv from 'dotenv'; // Import dotenv package
import User from '../../server/models/user.js'; // Import the User model

// Configure dotenv
dotenv.config();

// Function to send email with token to the user
export const sendTokenEmail = async (email, token) => {
    try {
        // Create a transporter with nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Construct the reset password link with token
        // Construct the reset password link with token and redirect parameter
         const resetPasswordLink = `http://connx.vercel.app/reset?token=${token}&redirect=http://connx.vercel.app/forgot-password`;


        // Define the email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset',
            html: `
                <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
                <p>Please click the following link to reset your password:</p>
                <p><a href="${resetPasswordLink}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
        };

        // Send the email using nodemailer transporter
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        // Handle error sending email
    }
};
