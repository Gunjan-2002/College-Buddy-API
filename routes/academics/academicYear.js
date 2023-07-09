const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require("../../controller/academics/academicYearCtrl");

const academicYearRouter = express.Router();

// academicYearRouter.post("/" , isLogin , isAdmin ,createAcademicYear);
// academicYearRouter.get("/" , isLogin , isAdmin, getAcademicYears);
// above two line have same end point so that we can use router chaining
academicYearRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicYear)
  .get(isLogin, isAdmin, getAcademicYears);

// academicYearRouter.get("/:id" , isLogin , isAdmin, getAcademicYear);
// academicYearRouter.put("/:id" , isLogin , isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id" , isLogin , isAdmin, deleteAcademicYear);
// same for above three lines router chaining
academicYearRouter
  .route("/:id")
  .get(isLogin, isAdmin, getAcademicYear)
  .put(isLogin, isAdmin, updateAcademicYear)
  .delete(isLogin, isAdmin, deleteAcademicYear);

module.exports = academicYearRouter;
