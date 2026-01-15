import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import classroomRoutes from "./routes/classrooms.js";
import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subjects.js";
import timetableRoutes from "./routes/timetables.js";
import facultyRoutes from "./routes/faculty.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log("MongoDB Connected:", conn.connection.name);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/timetables", timetableRoutes);



app.get("/api/test", (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
