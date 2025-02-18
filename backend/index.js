import express from "express";
import dotnev from "dotenv"; 
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
dotnev.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.listen(5000, () => {
    connectDB(); 
    console.log("Server is running on port ",PORT);
}

);
// uUFnBfPj0MMIsdnG