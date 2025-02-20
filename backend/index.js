// import express from "express";
// import dotnev from "dotenv"; 
// import cookieParser from "cookie-parser";
// import { connectDB } from "./db/connectDB.js";
// import authRoutes from "./routes/auth.route.js";
// dotnev.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(express.json());
// app.use(cookieParser());
// app.use("/api/auth",authRoutes);
// app.listen(5000, () => {
//     connectDB(); 
//     console.log("Server is running on port ",PORT);
// }

// );
// uUFnBfPj0MMIsdnG
import express from "express";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB(); 
    console.log("Server is running on port", PORT);
});  // Make sure to close the parenthesis here

