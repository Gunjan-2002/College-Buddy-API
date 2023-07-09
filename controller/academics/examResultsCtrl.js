const AsyncHandler = require("express-async-handler");
const examResultRouter = require("../../routes/academics/examResults");
const ExamResult = require("../../model/Academic/ExamResults");
const Student = require("../../model/Academic/Student");

// @desc Exam Result Checking
// @route POST /api/v1/exam-results/:id/checking
// @acess Private student only
exports.checkExamResults = AsyncHandler(async (req, res) => {
  // find the student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("No Student Found");
  }

  //find the exam results
  const examResult = await ExamResult.findOne({
    studentID: studentFound?.studentId,
    _id: req.params.id,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");

  // check if exam is published
  if (examResult?.isPublished === false) {
    throw new Error("Exam result is not available, check out later");
  }

  res.status(200).json({
    status: "sucsess",
    message: "Exam Result",
    data: examResult,
    student: studentFound,
  });
});

// @desc Get all Exam results (name , id)
// @route POST /api/v1/exam-results/
// @acess Private student only
exports.getAllExamResults = AsyncHandler(async (req, res) => {
  const results = await ExamResult.find().select("exam").populate("exam");
  res.status(200).json({
    status: "success",
    message: "Exam Result Fetched",
    data: results,
  });
});

// @desc Admin Publishing Exam Result
// @route POST /api/v1/exam-results/:id/admin-toggle-publish
// @acess Private admin only
exports.adminToggleExamResults = AsyncHandler(async (req, res) => {
  //find the exam result
  const examResult = await ExamResult.findById(req.params.id);

  if (!examResult) {
    throw new Error("Exam result not found");
  }

  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Exam Result Updated",
    data: publishResult,
  });
});
