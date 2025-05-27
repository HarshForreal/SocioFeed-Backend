import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("Backend API is running"));
export default app;
