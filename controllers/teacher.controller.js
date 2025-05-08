// CRUD Application - Create a Teacher, Read a Teacher, Update a Teacher, Delete a Teacher
// AUTHENTICATION - Teacher, TEACHER, Teacher

require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const Teacher = require("../models/teacher.modal");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  registerTeacher: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const teacher = await Teacher.findOne({ email: fields.email[0] });
        if (teacher) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        } else {
          const photo = files.image[0];
          let filePath = photo.filepath;
          // let originalFilename = photo.originalFilename.replace(" ", "_"); // photo name
          // let newPath = path.join(
          //   __dirname,
          //   process.env.TEACHER_IMAGE_PATH,
          //   originalFilename
          // );

          // let photoData = fs.readFileSync(filePath);
          // fs.writeFileSync(newPath, photoData);

          const result = await cloudinary.uploader.upload(filePath, {
            folder: "teacher", // Optional: specify a folder in Cloudinary
            public_id: photo.originalFilename.replace(" ", "_"),
          });

          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(fields.password[0], salt);

          const newTeacher = new Teacher({
            school: req.user.schoolId,
            email: fields.email[0],
            name: fields.name[0],
            age: fields.age[0],
            gender: fields.gender[0],
            qualification: fields.qualification[0],
            teacher_image: result.secure_url,
            password: hashPassword,
          });

          const savedTeacher = await newTeacher.save();
          res.status(200).json({
            success: true,
            data: savedTeacher,
            message: "Teacher registered successfully",
          });
        }
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Teacher registeration failed", // Internal Server Error
      });
    }
  },

  loginTeacher: async (req, res) => {
    try {
      const teacher = await Teacher.findOne({
        email: req.body.email,
      });
      if (teacher) {
        const isAuth = bcrypt.compareSync(req.body.password, teacher.password);
        if (isAuth) {
          const jwtSecret = process.env.JWT_SECRET;
          const token = jwt.sign(
            {
              id: teacher._id,
              schoolId: teacher.school,
              name: teacher.Teacher_name,
              image_url: teacher.teacher_image,
              role: "TEACHER",
            },
            jwtSecret
          );
          res.header("Authorization", token);
          res.status(200).json({
            success: true,
            message: "Teacher logged in successfully",
            user: {
              id: teacher._id,
              schoolId: teacher.school,
              teacher_name: teacher.name,
              image_url: teacher.teacher_image,
              role: "TEACHER",
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
          message: "Teacher Email is not registered!",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Teacher login failed).", // Internal Server Error
      });
    }
  },

  getTeachersWithQuery: async (req, res) => {
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

      const teachers = await Teacher.find(filterQuery);

      res.status(200).json({
        success: true,
        message: "All teachers data fetched successfully",
        teachers,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get all teachers data failed).", // Internal Server Error
      });
    }
  },

  getTeacherOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const schoolId = req.user.schoolId;
      const teacher = await Teacher.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);
      if (teacher) {
        res.status(200).json({
          success: true,
          message: "Teacher own data fetched successfully",
          teacher,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Teacher Data not found",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get Teacher own data failed).", // Internal Server Error
      });
    }
  },

  updateTeacher: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const teacher = await Teacher.findOne({ _id: id, school: schoolId });
        if (files.image) {
          const photo = files.image[0];
          let filePath = photo.filepath;

          // let originalFilename = photo.originalFilename.replace(" ", "_"); // photo name

          // if (teacher.teacher_image) {
          //   let oldImagePath = path.join(
          //     __dirname,
          //     process.env.TEACHER_IMAGE_PATH,
          //     teacher.teacher_image
          //   );
          //   if (fs.existsSync(oldImagePath)) {
          //     fs.unlink(oldImagePath, (err) => {
          //       if (err) {
          //         console.error("Error deleting old image:", err);
          //       }
          //     }); // delete old image
          //   }
          // }

          // let newPath = path.join(
          //   __dirname,
          //   process.env.TEACHER_IMAGE_PATH,
          //   originalFilename
          // );
          // let photoData = fs.readFileSync(filePath);
          // fs.writeFileSync(newPath, photoData);

          // Object.keys(fields).forEach((field) => {
          //   teacher[field] = fields[field][0];
          // });
          // teacher["teacher_image"] = originalFilename;

          const result = await cloudinary.uploader.upload(filePath, {
            folder: "teacher", // Optional: specify a folder in Cloudinary
            public_id: photo.originalFilename.replace(" ", "_"),
          });

          // Update teacher image URL
          teacher["teacher_image"] = result.secure_url;

          if (fields.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(fields.password[0], salt);
            teacher["password"] = hashPassword;
          }
        } else {
          // console.log(fields);
          Object.keys(fields).forEach((field) => {
            teacher[field] = fields[field][0];
          });
        }

        await teacher.save();
        res.status(200).json({
          success: true,
          message: "Teacher updated successfully",
          Teacher,
        });
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Teacher registeration failed", // Internal Server Error
      });
    }
  },

  deleteTeacherWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      await Teacher.findOneAndDelete({
        _id: id,
        school: schoolId,
      });
      const teachers = await Teacher.find({ school: schoolId });
      res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
        teachers,
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Delete Teacher failed (Internal Server Error ).", // Internal Server Error
      });
    }
  },

  getTeacherWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      const teacher = await Teacher.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);
      if (teacher) {
        res.status(200).json({
          success: true,
          message: "Teacher own data fetched successfully",
          Teacher,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Teacher Data not found",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get Teacher own data failed).", // Internal Server Error
      });
    }
  },
};
