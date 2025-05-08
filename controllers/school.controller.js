// CRUD Application - Create a School, Read a School, Update a School, Delete a School
// AUTHENTICATION - SCHOOL, TEACHER, STUDENT

require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const School = require("../models/school.modal");

module.exports = {
  registerSchool: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const school = await School.findOne({ email: fields.email[0] });
        if (school) {
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
            process.env.SCHOOL_IMAGE_PATH,
            originalFilename
          );

          let photoData = fs.readFileSync(filePath);
          fs.writeFileSync(newPath, photoData);

          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(fields.password[0], salt);

          const newSchool = new School({
            school_name: fields.school_name[0],
            email: fields.email[0],
            owner_name: fields.owner_name[0],
            school_image: originalFilename,
            password: hashPassword,
          });

          const savedSchool = await newSchool.save();
          res.status(200).json({
            success: true,
            data: savedSchool,
            message: "School registered successfully",
          });
        }
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "School registeration failed", // Internal Server Error
      });
    }
  },

  loginSchool: async (req, res) => {
    try {
      const school = await School.findOne({
        email: req.body.email,
      });
      if (school) {
        const isAuth = bcrypt.compareSync(req.body.password, school.password);
        if (isAuth) {
          const jwtSecret = process.env.JWT_SECRET;
          const token = jwt.sign(
            {
              id: school._id,
              schoolId: school._id,
              owner_name: school.owner_name,
              school_name: school.school_name,
              image_url: school.school_image,
              role: "SCHOOL",
            },
            jwtSecret
          );
          res.header("Authorization", token);
          res.status(200).json({
            success: true,
            message: "School logged in successfully",
            user: {
              id: school._id,
              owner_name: school.owner_name,
              school_name: school.school_name,
              image_url: school.school_image,
              role: "SCHOOL",
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
          message: "School Email is not registered!",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (School login failed).", // Internal Server Error
      });
    }
  },

  getAllSchools: async (req, res) => {
    try {
      const schools = await School.find().select([
        "-password",
        "-_id",
        "-email",
        "-owner_name",
        "-createdAt",
      ]);
      res.status(200).json({
        success: true,
        message: "All schools data fetched successfully",
        schools,
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get all schools data failed).", // Internal Server Error
      });
    }
  },

  getSchoolOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const school = await School.findOne({ _id: id }).select(["-password"]);
      if (school) {
        res.status(200).json({
          success: true,
          message: "School own data fetched successfully",
          school,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "School Data not found",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error (Get school own data failed).", // Internal Server Error
      });
    }
  },

  updateSchool: async (req, res) => {
    try {
      const id = req.user.id;
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const school = await School.findOne({ _id: id });
        if (files.image) {
          const photo = files.image[0];
          let filePath = photo.filepath;
          let originalFilename = photo.originalFilename.replace(" ", "_"); // photo name

          if (school.school_image) {
            let oldImagePath = path.join(
              __dirname,
              process.env.SCHOOL_IMAGE_PATH,
              school.school_image
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
            process.env.SCHOOL_IMAGE_PATH,
            originalFilename
          );
          let photoData = fs.readFileSync(filePath);
          fs.writeFileSync(newPath, photoData);

          Object.keys(fields).forEach((field) => {
            school[field] = fields[field][0];
          });
          school["school_image"] = originalFilename;
        } else {
          school["school_name"] = fields.school_name[0];
        }

        await school.save();
        res.status(200).json({
          success: true,
          message: "School updated successfully",
          school,
        });
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: "School registeration failed", // Internal Server Error
      });
    }
  },
};
