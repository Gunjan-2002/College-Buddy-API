const AsyncHandler = require("express-async-handler");

const Question = require("../../model/Academic/Questions");
const Exam = require("../../model/Academic/Exam");

// @desc Create Question
// @route POST /api/v1/questions/:examID
// @acess Private teacher only
exports.createQuestion = AsyncHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;

  //find the exam
  const examFound = await Exam.findById(req.params.examID);
  if (!examFound) {
    throw new Error("Exam not found");
  }

  //check if question exists
  const questionExists = await Question.findOne({ question });
  if (questionExists) {
    throw new Error("Question already exists !!!");
  }

  //create exam
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy: req.userAuth._id,
  });

  //add the question to the exam
  examFound.questions.push(questionCreated?._id);

  //save
  await examFound.save();

  res.status(201).json({
    status: "success",
    message: "Question created",
    data: questionCreated,
  });
});

// @desc Get all Questions
// @route GET /api/v1/questions
// @acess Private teacher only
exports.getQuestions = AsyncHandler(async (req, res) => {
  const questions = await Question.find();

  res.status(201).json({
    status: "success",
    message: "Questions fetched succesfully",
    data: questions,
  });
});

// @desc Get Single Question
// @route GET /api/v1/questions/:id
// @acess Private teacher only
exports.getQuestion = AsyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Question fetched succesfully",
    data: question,
  });
});

// @desc Update Question
// @route PUT /api/v1/questions/:id
// @acess Private teacher only
exports.updateQuestion = AsyncHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;

  //check question exists
  const questionFound = await Question.findOne({ question });
  if (questionFound) {
    throw new Error("Question already exists!!!!!");
  }

  const questionUpdated = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Question updated succesfully",
    data: questionUpdated,
  });
});
