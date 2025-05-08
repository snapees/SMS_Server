const { mongoose } = require("mongoose");

const noticeSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Notice", noticeSchema);
