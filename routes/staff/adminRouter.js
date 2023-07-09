const express = require("express");
const {
  registerAdmCtrl,
  loginAdminCtrl,
  getAdminsCtrl,
  getAdminProfileCtrl,
  updateAdminCtrl,
  deleteAdminCtrl,
  adminUnSuspendTeacherCtrl,
  adminSuspendTeacherCtrl,
  adminWithdrawTeacherCtrl,
  adminUnWithdrawTeacherCtrl,
  adminPublishResultsCtrl,
  adminUnPublishResultsCtrl,
} = require("../../controller/staff/adminCtrl");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const adminRouter = express.Router();

// Admin Register
adminRouter.post("/register", registerAdmCtrl);

// Admin Login
adminRouter.post("/login", loginAdminCtrl);

// Get all admin
adminRouter.get("/", isLogin ,getAdminsCtrl);

// Get single admins
adminRouter.get("/profile", isLogin, isAdmin ,getAdminProfileCtrl);

// Update Admin
adminRouter.put("/",isLogin , isAdmin , updateAdminCtrl);

// Delete Admin
adminRouter.delete("/:id", deleteAdminCtrl);

// Admin Suspend Teacher
adminRouter.put("/suspend/teacher/:id", adminSuspendTeacherCtrl);

// Admin Unsuspend Teacher
adminRouter.put("/unuspend/teacher/:id", adminUnSuspendTeacherCtrl);

// Admin withdrawing teacher
adminRouter.put("/withdraw/teacher/:id", adminUnWithdrawTeacherCtrl);

// Admin Unwithdrawing teacher
adminRouter.put("/unwithdraw/teacher/:id", adminUnWithdrawTeacherCtrl);

// Admin publishing exam result
adminRouter.put("/publish/exam/:id", adminPublishResultsCtrl);

// Admin unpublishing exam result
adminRouter.put("/publish/exam/:id", adminUnPublishResultsCtrl);

module.exports = adminRouter;
