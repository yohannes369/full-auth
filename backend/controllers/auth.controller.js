import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCokies } from "../utils/generateTokenAndSetCokies.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js"; // Ensure this line is present

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Validate input fields
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        // Check if the user already exists
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user instance
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiryAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        // Save the user to the database
        await user.save();

        // Generate token and set cookies
        generateTokenAndSetCokies(res, user._id);

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken); // This line now works

        // Send the success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
                verificationToken: user.verificationToken,
                verificationTokenExpiryAt: user.verificationTokenExpiryAt,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // Find the user with the matching verification token and ensure the token is not expired
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiryAt: { $gt: Date.now() },
        });

        // If no user is found, return an error
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }

        // Mark the user as verified and clear the verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiryAt = undefined; // Clear the expiry field as well
        await user.save();

        // Send a welcome email to the user
        await sendWelcomeEmail(user.email, user.name);

        // Return a success response
         res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error verifying email:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Other routes
export const login = (req, res) => res.send("It is the login route");
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}