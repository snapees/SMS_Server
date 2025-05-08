const Class = require("../models/class.modal");
const Student = require("../models/student.modal");
const Exam = require("../models/examination.modal");
const Schedule = require("../models/schedule.modal");

module.exports = {
  getAllClasses: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const allClasses = await Class.find({ school: schoolId });
      res.status(200).json({
        success: true,
        message: "Successfully Fetched all Classes.",
        data: allClasses,
      });
    } catch (error) {
      console.log("Fetching all classes", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching all Classes.",
      });
    }
  },

  getSingleClass: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const classId = req.params.id;
      const allClasses = await Class.findOne({
        school: schoolId,
        _id: classId,
      }).populate("attendee");
      res.status(200).json({
        success: true,
        message: "Successfully Fetched single Class.",
        data: allClasses,
      });
    } catch (error) {
      console.log("Fetching all classes", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching single Class.",
      });
    }
  },

  getAttendeeClass: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const attendeeId = req.user.id;
      // console.log(classId);
      const classes = await Class.find({
        school: schoolId,
        attendee: attendeeId,
      });
      res.status(200).json({
        success: true,
        message: "Successfully Fetched Attendee.",
        data: classes,
      });
      // console.log(allClasses);
    } catch (error) {
      console.log("Fetching all Attendee class", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching Attendee.",
      });
    }
  },

  createClass: async (req, res) => {
    try {
      const newClass = new Class({
        school: req.user.schoolId,
        class_text: req.body.class_text,
        class_num: req.body.class_num,
      });
      await newClass.save();
      res
        .status(200)
        .json({ success: true, message: "Succesfully Created the Class." });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server Error in Creating Class." });
    }
  },

  updateClassWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Class.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const classAfterUpdate = await Class.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Succesfully Updated the Class.",
        data: classAfterUpdate,
      });
    } catch (error) {
      console.log("Got error in updating", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in Updating Class." });
    }
  },

  deleteClassWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let schoolId = req.user.schoolId;

      const classStudentCount = (
        await Student.find({
          student_class: id,
          school: schoolId,
        })
      ).length;

      const classExamCount = (
        await Exam.find({
          class: id,
          school: schoolId,
        })
      ).length;

      const classScheduleCount = (
        await Schedule.find({
          class: id,
          school: schoolId,
        })
      ).length;

      if (
        classStudentCount === 0 &&
        classExamCount === 0 &&
        classScheduleCount === 0
      ) {
        await Class.findOneAndDelete({ _id: id, school: schoolId });

        res.status(200).json({
          success: true,
          message: "Succesfully Deleted the Class.",
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "This Class is allready in use." });
      }
    } catch (error) {
      console.log("Got error in deleting", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in Deleting Class." });
    }
  },
};
