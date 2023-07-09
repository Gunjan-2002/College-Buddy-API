const AsyncHandler = require("express-async-handler");
const Student = require("../../model/Academic/Student");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");
const Admin = require("../../model/Staff/Admin");

// @desc Admin Register Student
// @route POST /api/students/admin/register
// @acess Private admin only
exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
  const { name, email, password, classLevel } = req.body;

  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }

  //check if teacher already exist
  const studentFound = await Student.findOne({ email });
  if (studentFound) {
    throw new Error("Student already employed");
  }

  //Hash password
  const hashedPassword = await hashPassword(password);

  //create the student
  const studentCreated = await Student.create({
    name,
    email,
    password: hashedPassword,
  });

  //push teacher into admin
  adminFound.students.push(studentCreated?._id);
  await adminFound.save();

  //send student data
  res.status(201).json({
    status: "success",
    message: "Student registered succesfully",
    data: studentCreated,
  });
});

// @desc Login Student
// @route POST /api/students/login
// @acess Public
exports.loginStudent = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //find the student
  const student = await Student.findOne({ email });
  if (!student) {
    return res.json({ message: "Invalid Login Credentials" });
  }

  //verify the password
  const isMatched = await isPassMatched(password, student.password);

  if (!isMatched) {
    return res.json({ message: "Invalid Login Credentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Student logged in succesfully",
      data: generateToken(student?._id),
    });
  }
});

// @desc Student Profile
// @route GET /api/students/profile
// @acess Private students only
exports.getStudentProfile = AsyncHandler(async (req, res) => {
  //find the student
  const student = await Student.findById(req.userAuth?._id)
    .select("-password -createdAt -updatedAt")
    .populate("examResults");

  //if not found student
  if (!student) {
    throw new Error("Student not found");
  }

  //get the student profile
  const studentProfile = {
    name: student?.name,
    email: student?.email,
    currentClassLevel: student?.currentClassLevel,
    program: student?.program,
    dateAdmitted: student?.dateAdmitted,
    isSuspended: student?.isSuspended,
    isWithdrawn: student?.isWithdrawn,
    studentId: student?.studentId,
    prefectName: student?.prefectName,
  };

  //get student exam results
  const examResults = student?.examResults;
  //current exam
  const currentExamResult = examResults[examResults.length - 1];
  //check if exam is published
  const isPublished = currentExamResult?.isPublished;

  //send response
  res.status(200).json({
    status: "success",
    message: "Student profile fetched succesfully",
    data: {
      studentProfile,
      currentExamResult: isPublished ? currentExamResult : [],
    },
  });
});

// @desc Get All Students
// @route GET /api/admin/students
// @acess Private admin only
exports.getAllStudentsAdmin = AsyncHandler(async (req, res) => {
  const students = await Student.find();

  res.status(200).json({
    status: "success",
    message: "Students fetched succesfully",
    data: students,
  });
});

// @desc Get Single Student
// @route GET /api/students/:studentID/admin
// @acess Private admin only
exports.getStudentByAdmin = AsyncHandler(async (req, res) => {
  const studentID = req.params.studentID;
  //find the student
  const student = await Student.findById(studentID);

  //if not found student
  if (!student) {
    throw new Error("Student not found");
  }

  res.status(200).json({
    status: "success",
    message: "Student fetched succesfully",
    data: student,
  });
});

// @desc Student Updating Profile
// @route UPDATE /api/students/update
// @acess Private students only
exports.studentUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  // hash password

  //check if user is updating password
  if (password) {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student Profile updated succesfuly",
    });
  } else {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student Profile updated succesfuly",
    });
  }
});

// @desc Admin Updating Students eg: Assigning classes...
// @route UPDATE /api/students/:studentID/update/admin
// @acess Private admin only
exports.adminUpdateStudent = AsyncHandler(async (req, res) => {
  const {
    classLevels,
    academicYear,
    program,
    name,
    email,
    prefectName,
    isSuspended,
    isWithdrawn,
  } = req.body;

  //find the student by id
  const studentFound = await Student.findById(req.params.studentID);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentID,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
        isSuspended,
        isWithdrawn,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );

  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student updated succesfully",
  });
});

// @desc Student taking exams
// @route UPDATE /api/students/exams/:examID/write
// @acess Private student only
exports.writeExam = AsyncHandler(async (req, res) => {
  //get student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //get exam
  const examFound = await Exam.findById(req.params.examID)
    .populate("questions")
    .populate("academicTerm");
  if (!examFound) {
    throw new Error("Exam not found");
  }

  //get question
  const questions = examFound?.questions;

  //get students question answers
  const studentAnswers = req.body.answers;

  //check if student answerd all questions
  if (studentAnswers.length !== questions.length) {
    throw new Error("You have not answered all the question");
  }

  //check if student has already taken exams
  const stuentFoundResults = await ExamResult.findOne({
    student: studentFound?._id,
  });

  if (stuentFoundResults) {
    throw new Error("You have already written this exam");
  }

  //check if student is suspended/withdrawn
  if (studentFound.isWithdrawn || studentFound.isSuspended) {
    throw new Error("You are suspended/withdrawn, you can't take this exam");
  }

  //Build report object i.e how many answers correct or wrong
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let grade = 0;
  let score = 0;
  let answeredQuestions = [];
  let status = ""; // failed or pass
  let remarks = "";

  //check for answers
  for (let i = 0; i < questions.length; i++) {
    //find the question
    const question = questions[i];

    //check if the answer is correct
    if (question.correctAnswer == studentAnswers[i]) {
      correctAnswers++;
      score++;
      question.isCorrect = true;
    } else {
      wrongAnswers++;
    }
  }

  //calculate reports

  totalQuestions = questions.length;
  grade = (correctAnswers / questions.length) * 100;
  answeredQuestions = questions.map((question) => {
    return {
      question: question.question,
      correctanswer: question.correctAnswer,
      isCorrect: question.isCorrect,
    };
  });

  //calculate status
  if (grade >= 50) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  //Remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very Good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  //Generate Exam Result
  const examResults = await ExamResult.create({
    studentID: studentFound?.studentId,
    exam: examFound?._id,
    grade: grade,
    score: score,
    status: status,
    remarks: remarks,
    classLevel: examFound?.classLevel,
    academicTerm: examFound?.academicTerm,
    academicYear: examFound?.academicYear,
    answeredQuestions: answeredQuestions,
  });

  //push result into student
  studentFound.examResults.push(examResults?._id);

  //save the student
  await studentFound.save();

  //promoting student only if he passes the level 300
  //promote student to level 200
  if (
    examFound?.academicTerm?.name === "3'rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 100"
  ) {
    studentFound?.classLevels.push("Level 200");
    studentFound.currentClassLevel = "Level 200";
    await studentFound.save();
  }

  //promote student to level 300
  if (
    examFound?.academicTerm?.name === "3'rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 200"
  ) {
    studentFound?.classLevels.push("Level 300");
    studentFound.currentClassLevel = "Level 300";
    await studentFound.save();
  }

  //promote student to level 400
  if (
    examFound?.academicTerm?.name === "3'rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 300"
  ) {
    studentFound?.classLevels.push("Level 400");
    studentFound.currentClassLevel = "Level 400";
    await studentFound.save();
  }

  //promote student to Graduate
  if (
    examFound?.academicTerm?.name === "3'rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save();
  }

  res.status(200).json({
    status: "success",
    data: "You have submitted your exam. Check later for the results",
  });
});
