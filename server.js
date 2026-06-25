import express from "express";
import dotenv from "dotenv";
import authRouter from "./router/authRouter.js";
import { handleJsonSyntaxError, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Body-parsing middleware
app.use(express.json());

// Base status route
app.get("/", (req, res) => {
  res.send("User Authentication Server is running.");
});

// Auth API routing
app.use("/api/auth", authRouter);

// Error-handling middlewares
app.use(handleJsonSyntaxError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
