const express = require("express");

const {
  checkExamResults,
  getAllExamResults,
  adminToggleExamResults,
} = require("../../controller/academics/examResultsCtrl");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");

const examResultRouter = express.Router();

examResultRouter.get(
  "/:id/checking",
  isStudentLogin,
  isStudent,
  checkExamResults
);
examResultRouter.get("/", isStudentLogin, isStudent, getAllExamResults);
examResultRouter.put("/:id/admin-toggle-publish", isLogin, isAdmin, adminToggleExamResults);

module.exports = examResultRouter;
