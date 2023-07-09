const express = require("express");

const { adminRegisterStudent , loginStudent , getStudentProfile, getAllStudentsAdmin, getStudentByAdmin, studentUpdateProfile, adminUpdateStudent , writeExam} = require("../../controller/students/studentsCtrl");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isStudentLogin");


const studentRouter = express.Router();

studentRouter.post("/admin/register", isLogin, isAdmin, adminRegisterStudent);

studentRouter.post("/login", loginStudent);

studentRouter.get("/admin", isLogin, isAdmin, getAllStudentsAdmin);

studentRouter.get("/profile", isStudentLogin, isStudent, getStudentProfile);

studentRouter.get("/:studentID/admin", isLogin, isAdmin, getStudentByAdmin);

studentRouter.post("/exam/:examID/write", isStudentLogin , isStudent , writeExam);

studentRouter.put(
  "/update",
  isStudentLogin,
  isStudent,
  studentUpdateProfile
);

studentRouter.put(
  "/:studentID/update/admin",
  isLogin,
  isAdmin,
  adminUpdateStudent
);

module.exports = studentRouter;
