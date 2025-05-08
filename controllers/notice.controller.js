const Notice = require("../models/notice.modal");

module.exports = {
  getAllNotices: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const allNotices = await Notice.find({ school: schoolId });
      res.status(200).json({
        success: true,
        message: "Successfully Fetched all Notices.",
        data: allNotices,
      });
    } catch (error) {
      console.log("Fetching all Notices", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching all Notices.",
      });
    }
  },

  getTeacherNotices: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const allNotices = await Notice.find({
        school: schoolId,
        audience: "teacher",
      });
      res.status(200).json({
        success: true,
        message: "Successfully Fetched all Notices.",
        data: allNotices,
      });
    } catch (error) {
      console.log("Fetching all Notices", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching all Notices.",
      });
    }
  },

  getStudentNotices: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const allNotices = await Notice.find({
        school: schoolId,
        audience: "student",
      });
      res.status(200).json({
        success: true,
        message: "Successfully Fetched all Notices.",
        data: allNotices,
      });
    } catch (error) {
      console.log("Fetching all Notices", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching all Notices.",
      });
    }
  },

  createNotice: async (req, res) => {
    try {
      const { title, message, audience } = req.body;
      const newNotice = new Notice({
        school: req.user.schoolId,
        title: title,
        message: message,
        audience: audience,
      });
      await newNotice.save();
      res
        .status(200)
        .json({ success: true, message: "Succesfully Created the Notice." });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server Error in Creating Notice." });
    }
  },

  updateNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Notice.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const NoticeAfterUpdate = await Notice.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Succesfully Updated the Notice.",
        data: NoticeAfterUpdate,
      });
    } catch (error) {
      console.log("Got error in updating", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in Updating Notice." });
    }
  },

  deleteNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let schoolId = req.user.schoolId;

      await Notice.findOneAndDelete({ _id: id, school: schoolId });

      res.status(200).json({
        success: true,
        message: "Succesfully Deleted the Notice.",
      });
    } catch (error) {
      console.log("Got error in deleting", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in Deleting Notice." });
    }
  },
};
