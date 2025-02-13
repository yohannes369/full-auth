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

        // Send the success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc, // Corrected: Use 'user' instead of 'newUser'
                password: undefined // Exclude the password field
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Other routes
export const login = (req, res) => 
    res.send("It is the login route");

export const logout = (req, res) => 
    res.send("It is the logout route");