const AsyncHandler = require("express-async-handler");
const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");

// @desc Create Exam
// @route POST /api/v1/exams
// @acess Private teacher only
exports.createExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    academicYear,
    classLevel,
  } = req.body;

  //find the teacher
  const teacherFound = await Teacher.findById(req.userAuth?._id);
  if (!teacherFound) {
    throw new ErrorEvent("Teacher not found");
  }

  //exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    throw new ErrorEvent("Exam already exists");
  }

  //create exam
  const examCreated = await new Exam({
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    examTime,
    examType,
    subject,
    program,
    createdBy: req.userAuth?._id,
    duration,
    examDate,
  });

  //push the exam into teacher
  teacherFound.examsCreated.push(examCreated._id);

  //save exam
  await examCreated.save();
  await teacherFound.save();

  res.status(201).json({
    status: "success",
    message: "Exam Created",
    data: examCreated,
  });
});

// @desc Get all Exams
// @route GET /api/v1/exams
// @acess Private
exports.getExams = AsyncHandler(async (req, res) => {
  const exams = await Exam.find().populate({
    path: 'questions',
    populate: {
      path: "createdBy"
    }
  });

  res.status(201).json({
    status: "success",
    message: "Exams fetched succesfully",
    data: exams,
  });
});

// @desc Get Single Exam
// @route GET /api/v1/exams/:id
// @acess Private
exports.getExam = AsyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Exam fetched succesfully",
    data: exam,
  });
});

// @desc Update Exam
// @route PUT /api/v1/exams/:id
// @acess Private
exports.updateExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    academicYear,
    classLevel,
  } = req.body;

  //check name exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new Error("Exam already exists");
  }

  const examUpdated = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      createdBy: req.userAuth?._id,
      academicYear,
      classLevel,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Exam updated succesfully",
    data: examUpdated,
  });
});

// @desc Delete Exam
// @route DELETE /api/v1/exams/:id
// @acess Private
exports.deleteExam = AsyncHandler(async (req, res) => {
  await Exam.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Exam deleted succesfully",
  });
});
