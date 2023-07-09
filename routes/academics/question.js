const express = require("express");

const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const { createQuestion, getQuestions, getQuestion, updateQuestion } = require("../../controller/academics/questionCtrl");

const questionRouter = express.Router();

questionRouter.get("/" , isTeacherLogin , isTeacher , getQuestions);

questionRouter.post("/:examID" , isTeacherLogin , isTeacher , createQuestion);

questionRouter.get("/:id" , isTeacherLogin , isTeacher , getQuestion);

questionRouter.put("/:id" , isTeacherLogin , isTeacher , updateQuestion);


module.exports = questionRouter;