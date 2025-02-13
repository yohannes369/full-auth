import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true, // Ensures email is unique
            trim: true,  // Removes extra whitespace
            lowercase: true // Converts email to lowercase for consistency
        },
        password: {
            type: String,
            required: true,
            select: false // Excludes password from query results by default
        },
        name: {
            type: String,
            required: true,
            trim: true // Removes extra whitespace
        },
        lastLogin: {
            type: Date,
            default: Date.now // Sets the default value to the current date
        },
        isVerified: {
            type: Boolean,
            default: false // Indicates whether the user has verified their email
        },
        resetPasswordToken: String, // Token for password reset
        resetPasswordTokenExpiryAt: Date, // Expiry time for the password reset token
        verificationToken: String, // Token for email verification
        verificationTokenExpiryAt: Date // Expiry time for the email verification token
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Export the User model
export const User = mongoose.model("User", userSchema);