const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const { createSubject , getSubject , getSubjects , updateSubject , deleteSubject} = require("../../controller/academics/subjectCtrl");

const subjectRouter = express.Router();

subjectRouter.post("/:programID" , isLogin , isAdmin , createSubject);

subjectRouter.get("/" , isLogin , isAdmin , getSubjects);

subjectRouter.get("/:id" , isLogin , isAdmin , getSubject);

subjectRouter.put("/:id" , isLogin , isAdmin , updateSubject);

subjectRouter.delete("/:id" , isLogin , isAdmin , deleteSubject);


module.exports = subjectRouter;
