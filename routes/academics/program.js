const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const { createProgram , getProgram , getPrograms , updateProgram , deleteProgram } = require("../../controller/academics/programsCtrl");



const programRouter = express.Router();

// academicYearRouter.post("/" , isLogin , isAdmin ,createAcademicYear);
// academicYearRouter.get("/" , isLogin , isAdmin, getAcademicYears);
// above two line have same end point so that we can use router chaining
programRouter
  .route("/")
  .post(isLogin, isAdmin, createProgram)
  .get(isLogin, isAdmin, getPrograms);

// academicYearRouter.get("/:id" , isLogin , isAdmin, getAcademicYear);
// academicYearRouter.put("/:id" , isLogin , isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id" , isLogin , isAdmin, deleteAcademicYear);
// same for above three lines router chaining
programRouter
  .route("/:id")
  .get(isLogin, isAdmin, getProgram)
  .put(isLogin, isAdmin, updateProgram)
  .delete(isLogin, isAdmin, deleteProgram);

module.exports = programRouter;
