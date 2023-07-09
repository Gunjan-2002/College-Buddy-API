const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const { createClassLevel , getClassLevel , getClassLevels , updateClassLevel , deleteClassLevel} = require("../../controller/academics/classLevelCtrl");
createClassLevel


const classLevelRouter = express.Router();

// academicYearRouter.post("/" , isLogin , isAdmin ,createAcademicYear);
// academicYearRouter.get("/" , isLogin , isAdmin, getAcademicYears);
// above two line have same end point so that we can use router chaining
classLevelRouter
  .route("/")
  .post(isLogin, isAdmin, createClassLevel)
  .get(isLogin, isAdmin, getClassLevels);

// academicYearRouter.get("/:id" , isLogin , isAdmin, getAcademicYear);
// academicYearRouter.put("/:id" , isLogin , isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id" , isLogin , isAdmin, deleteAcademicYear);
// same for above three lines router chaining
classLevelRouter
  .route("/:id")
  .get(isLogin, isAdmin, getClassLevel)
  .put(isLogin, isAdmin, updateClassLevel)
  .delete(isLogin, isAdmin, deleteClassLevel);

module.exports = classLevelRouter;
