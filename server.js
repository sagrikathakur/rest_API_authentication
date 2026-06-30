import express from "express";
import dotenv from "dotenv";
import router from "./routes/userRoutes.js";


dotenv.config();

// Server instance
const myAuthentication = express();

// Port
const port = process.env.PORT;

// Middleware
myAuthentication.use(express.json());

// Routes
myAuthentication.use("/api/auth", router);

// Listen
myAuthentication.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});