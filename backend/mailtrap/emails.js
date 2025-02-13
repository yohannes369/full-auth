import { MailtrapClient,sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [
        {email}
    ]
    try {
        const response = await MailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            catagory:"Email Verification"
            
        });
        console.log("Email sent successfully:", response);
    } catch (error) {
        consolelog(`error sending verification , error`)
        throw new Error(`Failed to send verification email: ${error}`);
        }
    }
