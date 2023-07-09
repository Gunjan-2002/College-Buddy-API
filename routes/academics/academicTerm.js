const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const { createAcademicTerm , getAcademicTerm , getAcademicTerms , updateAcademicTerm , deleteAcademicTerm} = require("../../controller/academics/academicTermCtrl");


const academicTermRouter = express.Router();

// academicYearRouter.post("/" , isLogin , isAdmin ,createAcademicYear);
// academicYearRouter.get("/" , isLogin , isAdmin, getAcademicYears);
// above two line have same end point so that we can use router chaining
academicTermRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicTerm)
  .get(isLogin, isAdmin, getAcademicTerms);

// academicYearRouter.get("/:id" , isLogin , isAdmin, getAcademicYear);
// academicYearRouter.put("/:id" , isLogin , isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id" , isLogin , isAdmin, deleteAcademicYear);
// same for above three lines router chaining
academicTermRouter
  .route("/:id")
  .get(isLogin, isAdmin, getAcademicTerm)
  .put(isLogin, isAdmin, updateAcademicTerm)
  .delete(isLogin, isAdmin, deleteAcademicTerm);

module.exports = academicTermRouter;
