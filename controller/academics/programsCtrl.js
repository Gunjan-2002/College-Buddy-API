const AsyncHandler = require("express-async-handler");
const Program = require("../../model/Academic/Program");
const Admin = require("../../model/Staff/Admin");

// @desc Create Program
// @route POST /api/v1/programs
// @acess Private
exports.createProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // check academic term exist
  const programFound = await Program.findOne({ name });

  if (programFound) {
    throw new Error("Program already exist");
  }

  //create
  const programCreated = await Program.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });

  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.programs.push(programCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Program created succesfully",
    data: programCreated,
  });
});

// @desc Get all Programs
// @route GET /api/v1/programs
// @acess Private
exports.getPrograms = AsyncHandler(async (req, res) => {
  const programs = await Program.find();

  res.status(201).json({
    status: "success",
    message: "Programs fetched succesfully",
    data: programs,
  });
});

// @desc Get Single Program
// @route GET /api/v1/programs/:id
// @acess Private
exports.getProgram = AsyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Program fetched succesfully",
    data: program,
  });
});

// @desc Update Program
// @route PUT /api/v1/programs/:id
// @acess Private
exports.updateProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //check name exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("Program already exists");
  }

  const program = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Program updated succesfully",
    data: program,
  });
});

// @desc Delete Program
// @route DELETE /api/v1/programs/:id
// @acess Private
exports.deleteProgram = AsyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Program deleted succesfully",
  });
});
