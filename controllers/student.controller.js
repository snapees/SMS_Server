// CRUD Application - Create a Student, Read a Student, Update a Student, Delete a Student
// AUTHENTICATION - Student, TEACHER, STUDENT

require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../models/student.modal");

module.exports = {
  registerStudent: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const student = await Student.findOne({ email: fields.email[0] });
        if (student) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        } else {
          const photo = files.image[0];
          let filePath = photo.filepath;
          let originalFilename = photo.originalFilename.replace(" ", "_"); // photo name
          let newPath = path.join(
            __dirname,
            process.env.STUDENT_IMAGE_PATH,
            originalFilename
          );

          let photoData = fs.readFileSync(filePath);
          fs.writeFileSync(newPath, photoData);

          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(fields.password[0], salt);

          const newStudent = new Student({
            school: req.user.schoolId,
            email: fields.email[0],
            name: fields.name[0],
            student_class: fields.student_class[0],
            age: fields.age[0],
            gender: fields.gender[0],
            guardian: fields.guardian[0],
            guardian_phone: fields.guardian_phone[0],
            student_image: originalFilename,
            password: hashPassword,
          });

          const savedStudent = await newStudent.save();
          res.status(200).json({
            success: true,
            data: savedStudent,
            message: "Student registered successfully",
          });
        }
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Student registeration failed", // Internal Server Error
      });
    }
  },

  loginStudent: async (req, res) => {
    try {
      const student = await Student.findOne({
        email: req.body.email,
      });
      if (student) {
        const isAuth = bcrypt.compareSync(req.body.password, student.password);
        if (isAuth) {
          const jwtSecret = process.env.JWT_SECRET;
          const token = jwt.sign(
            {
              id: student._id,
              schoolId: student.school,
              name: student.student_name,
              image_url: student.student_image,
              role: "STUDENT",
            },
            jwtSecret
          );
          res.header("Authorization", token);
          res.status(200).json({
            success: true,
            message: "Student logged in successfully",
            user: {
              id: student._id,
              schoolId: student.school,
              student_name: student.student_name,
              image_url: student.student_image,
              role: "STUDENT",
            },
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Student Email is not registered!",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Student login failed).", // Internal Server Error
      });
    }
  },

  getStudentWithQuery: async (req, res) => {
    try {
      const filterQuery = {};
      const schoolId = req.user.schoolId;
      filterQuery["school"] = schoolId;

      const queryKeys = Object.keys(req.query);
      // console.log(queryKeys);
      // if (req.query.hasOwnProperty("search")) {
      if (queryKeys.includes("search")) {
        filterQuery["name"] = { $regex: req.query.search, $options: "i" };
      }

      // if (req.query.hasOwnProperty("student_class")) {
      if (queryKeys.includes("student_class")) {
        // console.log(req.query.student_class);
        filterQuery["student_class"] = req.query.student_class;
      }

      const students = await Student.find(filterQuery).populate(
        "student_class"
      );
      // .select(["-password"]);
      res.status(200).json({
        success: true,
        message: "All Students data fetched successfully",
        students,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get all Students data failed).", // Internal Server Error
      });
    }
  },

  getStudentOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const schoolId = req.user.schoolId;
      const student = await Student.findOne({
        _id: id,
        school: schoolId,
      })
        .select(["-password"])
        .populate("student_class");
      if (student) {
        res.status(200).json({
          success: true,
          message: "Student own data fetched successfully",
          student,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Student Data not found",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get Student own data failed).", // Internal Server Error
      });
    }
  },

  updateStudent: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const student = await Student.findOne({ _id: id, school: schoolId });
        if (files.image) {
          const photo = files.image[0];
          let filePath = photo.filepath;
          let originalFilename = photo.originalFilename.replace(" ", "_"); // photo name

          if (student.student_image) {
            let oldImagePath = path.join(
              __dirname,
              process.env.STUDENT_IMAGE_PATH,
              student.student_image
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlink(oldImagePath, (err) => {
                if (err) {
                  console.error("Error deleting old image:", err);
                }
              }); // delete old image
            }
          }

          let newPath = path.join(
            __dirname,
            process.env.STUDENT_IMAGE_PATH,
            originalFilename
          );
          let photoData = fs.readFileSync(filePath);
          fs.writeFileSync(newPath, photoData);

          Object.keys(fields).forEach((field) => {
            student[field] = fields[field][0];
          });
          student["student_image"] = originalFilename;

          if (fields.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(fields.password[0], salt);
            student["password"] = hashPassword;
          }
        } else {
          // console.log(fields);
          Object.keys(fields).forEach((field) => {
            student[field] = fields[field][0];
          });
        }

        await student.save();
        res.status(200).json({
          success: true,
          message: "Student updated successfully",
          student,
        });
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Student registeration failed", // Internal Server Error
      });
    }
  },

  deleteStudentWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      await Student.findOneAndDelete({
        _id: id,
        school: schoolId,
      });
      const students = await Student.find({ school: schoolId });
      res.status(200).json({
        success: true,
        message: "Student deleted successfully",
        students,
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Delete Student failed (Internal Server Error ).", // Internal Server Error
      });
    }
  },

  getStudentWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      const student = await Student.findOne({
        _id: id,
        school: schoolId,
      })
        .select(["-password"])
        .populate("student_class");
      if (student) {
        res.status(200).json({
          success: true,
          message: "Student own data fetched successfully",
          student,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Student Data not found",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get Student own data failed).", // Internal Server Error
      });
    }
  },
};
