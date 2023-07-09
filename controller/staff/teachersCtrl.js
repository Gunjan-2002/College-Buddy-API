const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Admin = require("../../model/Staff/Admin");

// @desc Admin Register Teacher
// @route POST /api/teachers/admin/register
// @acess Private
exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }

  //check if teacher already exist
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    throw new Error("Teacher already employed");
  }

  //Hash password
  const hashedPassword = await hashPassword(password);

  //create the teacher
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
  });

  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();

  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered succesfully",
    data: teacherCreated,
  });
});

// @desc Login Teacher
// @route POST /api/teachers/login
// @acess Public
exports.loginTeacher = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //find the user
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.json({ message: "Invalid Login Credentials" });
  }

  //verify the password
  const isMatched = await isPassMatched(password, teacher.password);

  if (!isMatched) {
    return res.json({ message: "Invalid Login Credentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Teacher logged in succesfully",
      data: generateToken(teacher?._id),
    });
  }
});

// @desc Get All Teacher
// @route GET /api/admin/teachers
// @acess Private admin only
exports.getAllTeachersAdmin = AsyncHandler(async (req, res) => {
  let TeacherQuery = Teacher.find();

  //convert query string to number
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const skip = (page - 1) * limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  //filtering/searching
  if (req.query.name) {
    TeacherQuery = TeacherQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //get total count
  const total = await Teacher.countDocuments();

  //pagination result
  const pagination = {};

  //add next
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  //add prev
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // execute query
  const teachers = await TeacherQuery.find().skip(skip).limit(limit);

  res.status(200).json({
    total,
    pagination,
    results: teachers.length,
    status: "success",
    message: "Teachers fetched succesfully",
    data: teachers,
  });
});

// @desc Get Single Teacher
// @route GET /api/teachers/:teacherID/admin
// @acess Private admin only
exports.getTeacherByAdmin = AsyncHandler(async (req, res) => {
  const teacherID = req.params.teacherID;
  //find the teacher
  const teacher = await Teacher.findById(teacherID);

  //if not found teacher
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  res.status(200).json({
    status: "success",
    message: "Teacher fetched succesfully",
    data: teacher,
  });
});

// @desc Teacher Profile
// @route GET /api/teachers/profile
// @acess Private teacher only
exports.getTeacherProfile = AsyncHandler(async (req, res) => {
  //find the teacher
  const teacher = await Teacher.findById(req.userAuth?._id).select(
    "-password -createdAt -updatedAt"
  );

  //if not found teacher
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  res.status(200).json({
    status: "success",
    message: "Teacher profile fetched succesfully",
    data: teacher,
  });
});

// @desc Teacher Updating Profile Admin
// @route UPDATE /api/teachers/:teacherID/update
// @acess Private teacher only
exports.teacherUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  //if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  // hash password

  //check if user is updating password
  if (password) {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
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
      data: teacher,
      message: "Teacher Profile updated succesfuly",
    });
  } else {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
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
      data: teacher,
      message: "Teacher Profile updated succesfuly",
    });
  }
});

// @desc Admin Updating Teacher Profile
// @route UPDATE /api/teachers/:teacherID/admin
// @acess Private admin only
exports.adminUpdateTeacher = AsyncHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;

  //if teacher found check
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }

  //check if teacher is withdrawn
  if (teacherFound.isWitdrawn) {
    throw new Error("Action denied, teacher is withdraw");
  }

  //assign a program
  if (program) {
    teacherFound.program = program;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher Profile updated succesfuly",
    });
  }

  //assign a class level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher Profile updated succesfuly",
    });
  }

  //assign a academic year
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher Profile updated succesfuly",
    });
  }

  //assign a subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher Profile updated succesfuly",
    });
  }
});
