const AsyncHandler = require("express-async-handler");
const ClassLevel = require("../../model/Academic/ClassLevel");
const Admin = require("../../model/Staff/Admin");


// @desc Create Class Level
// @route POST /api/v1/class-levels
// @acess Private
exports.createClassLevel = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  // check academic term exist
  const classFound = await ClassLevel.findOne({ name });

  if (classFound) {
    throw new Error("Class already exist");
  }

  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });

  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Class Level created succesfully",
    data: classCreated,
  });
});

// @desc Get all class levels
// @route GET /api/v1/class-levels
// @acess Private
exports.getClassLevels = AsyncHandler(async (req, res) => {
  const classes = await ClassLevel.find();

  res.status(201).json({
    status: "success",
    message: "Class Levels fetched succesfully",
    data: classes,
  });
});

// @desc Get Single Class Level
// @route GET /api/v1/class-levels/:id
// @acess Private
exports.getClassLevel = AsyncHandler(async (req, res) => {
  const classLevel = await ClassLevel.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class Level fetched succesfully",
    data: classLevel,
  });
});

// @desc Update Class Level
// @route PUT /api/v1/class-levels/:id
// @acess Private
exports.updateClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //check name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class already exists");
  }

  const classLevel = await ClassLevel.findByIdAndUpdate(
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
    message: "Class Level updated succesfully",
    data: classLevel,
  });
});

// @desc Delete Class Level
// @route DELETE /api/v1/class-levels/:id
// @acess Private
exports.deleteClassLevel = AsyncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class Level deleted succesfully",
  });
});
