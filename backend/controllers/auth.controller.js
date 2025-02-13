import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCokies } from "../utils/generateTokenAndSetCokies.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Validate input fields
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        // Check if the user already exists
        const userAlreadyExists = await User.findOne({ email }); // Corrected: Use 'User' instead of 'user'
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
            verificationTokenExpiryAt: Date.now() + 24 * 60 * 60 * 1000
        });

        // Save the user to the database
        await user.save(); // Corrected: Use 'user' instead of 'newUser'

        // Generate token and set cookies
        generateTokenAndSetCokies(res, user._id);
       await sendVerificationEmail(user.email, verificationToken);

        // Send the success response with explicit inclusion of verificationToken and verificationTokenExpiryAt
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc, // Spread all fields from the user document
                password: undefined, // Exclude the password field
                verificationToken: user.verificationToken, // Explicitly include verificationToken
                verificationTokenExpiryAt: user.verificationTokenExpiryAt // Explicitly include verificationTokenExpiryAt
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Other routes
export const login = (req, res) => 
    res.send("It is the login route");

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Logs out the user by clearing the authentication token from the cookies.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the response.
 */

/******  40d29aa1-f50c-4abd-a573-ceda03aa85b3  *******/
export const logout = (req, res) => 
    res.send("It is the logout route");