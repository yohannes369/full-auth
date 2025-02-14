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

    export const sendWelcomeEmail = async (email, name) => {
        const recipients = [{ email }]; // Ensure recipients is an array of objects
    
        try {
            const response = await mailtrapClient.send({
                from: sender, // Ensure `sender` is defined
                to: recipients,
                template_uuid: "052b3353-7a60-4eb2-a87d-6d6fe44f5d4b", // Template UUID
                template_variables: {
                    "company_info_name": "jo company", // Company name
                    "name": name // User's name
                }
            });
    
            console.log("Welcome email sent successfully:", response);
        } catch (error) {
            console.error("Error sending welcome email:", error);
            throw new Error(`Failed to send welcome email: ${error.message}`);
        }
    };
