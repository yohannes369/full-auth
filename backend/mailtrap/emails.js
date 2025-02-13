import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [
        {email}
    ]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
            
        });
        console.log("Email sent successfully:", response);
    } catch (error) {
        console.log(`error sending verification , error`)
        throw new Error(`Failed to send verification email: ${error}`);
        }
    }
