import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        console.log("mongo uri", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("error connetion to mongo db  ", error.message);
        process.exit(1);
    }
}