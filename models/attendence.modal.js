const { mongoose } = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School" },
  student: { type: mongoose.Schema.ObjectId, ref: "Student" },
  class: { type: mongoose.Schema.ObjectId, ref: "Class" },
  date: { type: Date, default: Date.now() },
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
