const Subject = require("../models/subject.modal");
const Student = require("../models/student.modal");
const Exam = require("../models/examination.modal");
const Schedule = require("../models/schedule.modal");

module.exports = {
  getAllSubjects: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const allSubjects = await Subject.find({ school: schoolId });
      res.status(200).json({
        success: true,
        message: "Successfully Fetched all Subjects.",
        data: allSubjects,
      });
      // console.log(allSubjects);
    } catch (error) {
      console.log("Fetching all Subjects", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Fetching all Subjects.",
      });
    }
  },

  createSubject: async (req, res) => {
    try {
      const newSubject = new Subject({
        school: req.user.schoolId,
        subject_name: req.body.subject_name,
        subject_codename: req.body.subject_codename,
      });
      await newSubject.save();
      res
        .status(200)
        .json({ success: true, message: "Succesfully Created the Subject." });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server Error in Creating Subject." });
    }
  },

  updateSubjectWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Subject.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const SubjectAfterUpdate = await Subject.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Succesfully Updated the Subject.",
        data: SubjectAfterUpdate,
      });
    } catch (error) {
      console.log("Got error in updating", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in Updating Subject." });
    }
  },

  deleteSubjectWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let schoolId = req.user.schoolId;

      const SubjectExamCount = (
        await Exam.find({
          subject: id,
          school: schoolId,
        })
      ).length;

      const SubjectScheduleCount = (
        await Schedule.find({
          subject: id,
          school: schoolId,
        })
      ).length;

      if (SubjectExamCount === 0 && SubjectScheduleCount === 0) {
        await Subject.findOneAndDelete({ _id: id, school: schoolId });

        res.status(200).json({
          success: true,
          message: "Succesfully Deleted the Subject.",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "This Subject is allready in use.",
        });
      }
    } catch (error) {
      console.log("Got error in deleting", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in Deleting Subject." });
    }
  },
};
