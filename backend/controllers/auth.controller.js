import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";
   
import { generateTokenAndSetCokies } from "../utils/generateTokenAndSetCokies.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await user.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = new user({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiryAt: Date.now() + 24 * 60 * 60 * 1000
        });
        await newUser.save();
        
        generateTokenAndSetCookies(res, user._id);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...newUser._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = (req, res) => 
    res.send(" it is login route ");

export const logout = (req, res) => 
    res.send(" it is logout route ");
