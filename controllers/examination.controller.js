const Examination = require("../models/examination.modal");

module.exports = {
  newExamination: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const { date, subjectId, examType, classId } = req.body;
      const newExamination = new Examination({
        school: schoolId,
        examDate: date,
        subject: subjectId,
        examType: examType,
        class: classId,
      });
      const savedData = await newExamination.save();
      res.status(200).json({
        success: true,
        message: "Success in Creating in new examination.",
        data: savedData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in Creating Examination." });
    }
  },

  getAllExaminations: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const examinations = await Examination.find({ school: schoolId });
      res.status(200).json({
        success: true,
        examinations,
        // message: "Success in Fetching all examination.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in Fetching Examination." });
    }
  },

  getExaminationsByClass: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const classId = req.params.id;
      const examinations = await Examination.find({
        school: schoolId,
        class: classId,
      }).populate("subject");
      res.status(200).json({
        success: true,
        examinations,
        // message: "Success in Fetching all examination.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in Fetching Examination." });
    }
  },

  updateExaminationWithId: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const examinationId = req.params.id;
      const { date, subjectId, examType } = req.body;

      await Examination.findOneAndUpdate(
        {
          _id: examinationId,
          school: schoolId,
        },
        {
          $set: {
            examDate: date,
            subject: subjectId,
            examType: examType,
          },
        }
      );
      res.status(200).json({
        success: true,
        message: "Success in Updating examination.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in Updating Examination." });
    }
  },

  deleteExaminationWithId: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const examinationId = req.params.id;
      await Examination.findOneAndDelete({
        _id: examinationId,
        school: schoolId,
      });
      res.status(200).json({
        success: true,
        message: "Success in Deleting examination.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in Deleting Examination." });
    }
  },
};
