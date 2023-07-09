const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

// @desc Register admin
// @route POST /api/admins/register
// @acess Private
exports.registerAdmCtrl = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    // res.json("Admin Exists");
    throw new Error("Admin Exists");
  }

  // Register
  const user = await Admin.create({
    name,
    email,
    password: await hashPassword(password),
  });
  res.status(201).json({
    status: "success",
    data: user,
    message: "Admin registered succesfully",
  });
});

// @desc Login Admins
// @route POST /api/admins/login
// @acess Private
exports.loginAdminCtrl = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find User
  const user = await Admin.findOne({ email });
  if (!user) {
    return res.json({ message: "Invalid login credentials" });
  }

  //verify password
  const isMatched = await isPassMatched(password, user.password);

  if (!isMatched) {
    return res.json({ message: "Invalid login credentials" });
  } else {
    return res.json({
      data: generateToken(user._id),
      message: "Admin logged in succesfully",
    });
  }
});

// @desc Get All Admins
// @route GET /api/admins
// @acess Private
exports.getAdminsCtrl = AsyncHandler(async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json({
    status: "success",
    message: "Admin fetched succesfully",
    data: admins,
  });
});

// @desc Get Admin
// @route GET /api/admins/:id
// @acess Private
exports.getAdminProfileCtrl = AsyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt -updatedAt")
    .populate("academicYears academicTerms programs yearGroups classLevels students teachers");

  if (!admin) {
    throw new Error("Admin not found");
  } else {
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin profile fetched in succesfully",
    });
  }
});

// @desc Update Admin
// @route UPDATE /api/admins/:id
// @acess Private
exports.updateAdminCtrl = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  //if email is taken
  const emailExist = await Admin.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  // hash password

  //check if user is updating password
  if (password) {
    //update
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated succesfuly",
    });
  } else {
    //update
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated succesfuly",
    });
  }
});

// @desc Delete Admin
// @route DELETE /api/admins/:id
// @acess Private
exports.deleteAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Delete Admins",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc Admin Suspend Teacher
// @route PUT /api/admins/suspend/teacher/:id
// @acess Private
exports.adminSuspendTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc Admin UnSuspend Teacher
// @route PUT /api/admins/unsuspend/teacher/:id
// @acess Private
exports.adminUnSuspendTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Admin Unsuspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc Admin Withdraw Teacher
// @route PUT /api/admins/withdraw/teacher/:id
// @acess Private
exports.adminWithdrawTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Admin withdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc Admin UnWithdraw Teacher
// @route PUT /api/admins/unwithdraw/teacher/:id
// @acess Private
exports.adminUnWithdrawTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Admin Unwithdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc Admin Publish Exam Result
// @route PUT /api/admins/publish/exam/:id
// @acess Private
exports.adminPublishResultsCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Admin publish exam result",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc Admin UnPublish Exam Result
// @route PUT /api/admins/unpublish/exam/:id
// @acess Private
exports.adminUnPublishResultsCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Admin Unpublish exam result",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
