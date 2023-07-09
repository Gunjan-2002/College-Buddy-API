const express = require("express");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const { createExam , getExams , getExam , updateExam, deleteExam} = require("../../controller/academics/examsCtrl");

const examRouter = express.Router();

// examRouter.route("/").post(isTeacherLogin , isTeacher , createExam);
// examRouter.route("/").get(isTeacherLogin , isTeacher , getExams);

examRouter.route("/").post(isTeacherLogin , isTeacher , createExam).get(isTeacherLogin , isTeacher , getExams);

examRouter.route("/:id").get(isTeacherLogin , isTeacher , getExam).put(isTeacherLogin , isTeacher , updateExam).delete(isTeacherLogin , isTeacher , deleteExam);

module.exports = examRouter;