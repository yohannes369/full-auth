import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCokies } from "../utils/generateTokenAndSetCokies.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from "../mailtrap/emails.js"; // Ensure this line is present

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
        const hashedPassword = await bcryptjs.hash(password, 10);

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
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        // Find the user and explicitly select the password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        // Check if user.password exists
        if (!user.password) {
            return res.status(400).json({ success: false, message: "User password not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate token and set cookies
        generateTokenAndSetCokies(res, user._id);

        // Update the last login time
        user.lastloginAt = new Date();
        await user.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined, // Exclude the password from the response
            },
        });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
// export const forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     try{
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ success: false, message: "User not found" });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");

//     const resetTokenExpiryAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordTokenExpiryAt = resetTokenExpiryAt;
//     await user.save();

//     // Send password reset email
    
//     await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

//     res.status(200).json({ success: true, message: "Password reset email sent successfully" });
//     }
//     catch(error){
//         console.error("Error forgot password:", error);
//         res.status(400).json({ success: false, message: error });

//     }

// }
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiryAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};export const resetpassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        console.log("Received reset token:", token);

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiryAt: { $gt: Date.now() },
        });

        if (!user) {
            console.log("No user found or token expired.");
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        console.log("User found:", user.email);

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiryAt = undefined;
        await user.save();

        console.log("Password reset successful for:", user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetpassword:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
