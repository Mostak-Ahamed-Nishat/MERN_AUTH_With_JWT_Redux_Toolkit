import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";

import {
  errorHandler,
  notFound
} from "./middleware/errorMiddleware.js";
import connectDB from "./db.js";






const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/api/users", userRoutes);


//Connect DB
connectDB();


//Error handling middleware
app.use(notFound)
app.use(errorHandler)


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});