import nodemailer from "nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import WelcomeEmail from "../../emails/WelcomeEmail";
import { render } from "@react-email/components"; 
import ForgotPasswordEmail from "../../emails/ForgotPasswordEmail";
import ResetSuccessEmail from "../../emails/ResetSuccessEmail";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yousaf.8666305@gmail.com", // Gmail address
        pass: "mojn wlnd wqio xrqs", // Gmail App Password
    },
});

export const sendEmail = async (email: string, subject: string, otp: string, username: string) => {
    try {
       const html = await render(<VerificationEmail username={username} otp={otp} />);
		
        const info = await transporter.sendMail({
            from: '"FsdFoods" <yousaf.8666305@gmail.com>', // Your Gmail
            to: email, // Receiver email
            subject, // Email subject
            html,// HTML body
        });
 
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};


export const sendWelcomeEmail = async (email: string, username: string) => {
    try {

        const html = await render(<WelcomeEmail username={username}/>);
        
        const info = await transporter.sendMail({
            from: '"FsdFoods" <yousaf.8666305@gmail.com>', // Your Gmail
            to: email, // Receiver email
            subject: "Welcome to FsdFoods", // Email subject
            html,// HTML body
        });
 
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export const sendPasswordResetEmail = async (email: string, username: string, resetLink: string) => {
    try { 
    
        // Render the HTML email using React Email
        const html = await render(<ForgotPasswordEmail username={username} resetLink={resetLink} />);
    
        // Send the email
        const info = await transporter.sendMail({
          from: '"FsdFoods" <yousaf.8666305@gmail.com>',
          to: email,
          subject: 'Reset your password',
          html,
        });
     
        return info;
      } catch (error) {
        console.error("Error sending forgot password email:", error);
        throw error;
      }
};

export const sendResetSuccessEmail = async (email: string) => {
    try {
        const html = await render(<ResetSuccessEmail />);

        const info = await transporter.sendMail({
          from: `"FsdFoods" <yourcompanyemail@gmail.com>`, // Your sender name + email
          to: email,
          subject: "Password Reset Successful - FsdFoods 🍔",
          html, // Rendered HTML content
        });
     
        return info;
    } catch (error) {
        console.error("Error sending forgot password email:", error);
        throw error;
    }
}