require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// ROUTES IMPORTS
const schoolRouter = require("./routers/school.router");
const classRouter = require("./routers/class.router");
const subjectRouter = require("./routers/subject.router");
const studentRouter = require("./routers/student.router");
const teacherRouter = require("./routers/teacher.router");
const scheduleRouter = require("./routers/schedule.router");
const attendanceRouter = require("./routers/attendance.router");
const examinationRouter = require("./routers/examination.router");
const noticeRouter = require("./routers/notice.router");

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOption = { exposedHeaders: "Authorization" };
app.use(cors(corsOption));
app.use(cookieParser());

// mongodb connection
mongoose
  // .connect(`mongodb://localhost:27017/schoolManagement2025`)
  .connect(process.env.MONGO_SERVER)
  .then((db) => {
    console.log("MongoDB is connected successfully");
  })
  .catch((e) => {
    console.log("MongoDB connection error: ", e);
  });

// app.get("/test", (req, res) => {
//   res.send({ id: 1, message: "Welcome to the School Management API" });
// });

// ROUTES
app.use("/api/school", schoolRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/examination", examinationRouter);
app.use("/api/notice", noticeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
