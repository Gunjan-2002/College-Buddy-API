const AsyncHandler = require("express-async-handler");
const Program = require("../../model/Academic/Program");
const Subject = require("../../model/Academic/Subject");
const Admin = require("../../model/Staff/Admin");

// @desc Create Subject
// @route POST /api/v1/programs/subjects/:programID
// @acess Private
exports.createSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;

  //find the program
  const programFound = await Program.findById(req.params.programID);
  if (!programFound) {
    throw new Error("Program not found");
  }

  // check subject exist
  const subjectFound = await Subject.findOne({ name });

  if (subjectFound) {
    throw new Error("Subject already exist");
  }

  //create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth._id,
  });

  //push to the program
  programFound.subjects.push(subjectCreated._id);

  //save
  await programFound.save();

  res.status(201).json({
    status: "success",
    message: "Subject created succesfully",
    data: subjectCreated,
  });
});

// @desc Get all Subjects
// @route GET /api/v1/subjects
// @acess Private
exports.getSubjects = AsyncHandler(async (req, res) => {
  const subjects = await Subject.find();

  res.status(201).json({
    status: "success",
    message: "Subjects fetched succesfully",
    data: subjects,
  });
});

// @desc Get Single Subject
// @route GET /api/v1/subjects/:id
// @acess Private
exports.getSubject = AsyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject fetched succesfully",
    data: subject,
  });
});

// @desc Update Subject
// @route PUT /api/v1/subjects/:id
// @acess Private
exports.updateSubject = AsyncHandler(async (req, res) => {
  const { name, description , academicTerm} = req.body;

  //check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject already exists");
  }

  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Subject updated succesfully",
    data: subject,
  });
});

// @desc Delete Subject
// @route DELETE /api/v1/subjects/:id
// @acess Private
exports.deleteSubject = AsyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject deleted succesfully",
  });
});
