const AsyncHandler = require("express-async-handler");
const AcademicTerm = require("../../model/Academic/AcademicTerm");
const Admin = require("../../model/Staff/Admin");

// @desc Create Academic Term
// @route POST /api/v1/academic-terms
// @acess Private
exports.createAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  // check academic term exist
  const academicTerm = await AcademicTerm.findOne({ name });

  if (academicTerm) {
    throw new Error("Academic term already exist");
  }

  //create
  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });

  //push academic yer into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Academic Term created succesfully",
    data: academicTermCreated,
  });
});

// @desc Get All Academic Terms
// @route GET /api/v1/academic-terms
// @acess Private
exports.getAcademicTerms = AsyncHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.find();

  res.status(201).json({
    status: "success",
    message: "Academic Terms fetched succesfully",
    data: academicTerms,
  });
});

// @desc Get Single Academic Terms
// @route GET /api/v1/academic-terms/:id
// @acess Private
exports.getAcademicTerm = AsyncHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic Term fetched succesfully",
    data: academicTerms,
  });
});

// @desc Update Academic Term
// @route PUT /api/v1/academic-terms/:id
// @acess Private
exports.updateAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  //check name exists
  const createAcademicTermFound = await AcademicTerm.findOne({ name });
  if (createAcademicTermFound) {
    throw new Error("Academic Term already exists");
  }

  const academicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Academic term updated succesfully",
    data: academicTerm,
  });
});

// @desc Delete Academic Term
// @route DELETE /api/v1/academic-terms/:id
// @acess Private
exports.deleteAcademicTerm = AsyncHandler(async (req, res) => {
  await AcademicTerm.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic term deleted succesfully",
  });
});
