const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const { createYearGroup , getYearGroups , getYearGroup , updateYearGroup , deleteYearGroup } = require("../../controller/academics/yearGroupsCtrl");


const yearGroupRouter = express.Router();

// yearGroupRouter.post("/" , isLogin , isAdmin , createSubject);
// yearGroupRouter.get("/" , isLogin , isAdmin , getSubjects);

yearGroupRouter.route("/").post(isLogin , isAdmin , createYearGroup).get(isLogin , isAdmin , getYearGroups);



// yearGroupRouter.get("/:id" , isLogin , isAdmin , getSubject);
// yearGroupRouter.put("/:id" , isLogin , isAdmin , updateSubject);
// yearGroupRouter.delete("/:id" , isLogin , isAdmin , deleteSubject);
yearGroupRouter.route("/:id").get(isLogin , isAdmin , getYearGroup).put(isLogin , isAdmin , updateYearGroup).delete(isLogin , isAdmin , deleteYearGroup);


module.exports = yearGroupRouter;
