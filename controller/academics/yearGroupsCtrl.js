const AsyncHandler = require("express-async-handler");
const Program = require("../../model/Academic/Program");
const Subject = require("../../model/Academic/Subject");
const Admin = require("../../model/Staff/Admin");
const YearGroup = require("../../model/Academic/YearGroup");

// @desc Create Year Group
// @route POST /api/v1/year-groups
// @acess Private
exports.createYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  // check year group exist
  const yeargroup = await YearGroup.findOne({ name });

  if (yeargroup) {
    throw new Error("Year Group/Graduation already exist");
  }

  //create
  const yearGroup = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });

  //find the admin
  const admin = await Admin.findById(req.userAuth._id);
  if (!admin) {
    throw new Error("Admin not found");
  }
  //push year group into the admin
  admin.yearGroups.push(yearGroup._id);

  //save
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Year Group created succesfully",
    data: yearGroup,
  });
});

// @desc Get all Year Groups
// @route GET /api/v1/year-groups
// @acess Private
exports.getYearGroups = AsyncHandler(async (req, res) => {
  const groups = await YearGroup.find();

  res.status(201).json({
    status: "success",
    message: "Year groups fetched succesfully",
    data: groups,
  });
});

// @desc Get Single Year Group
// @route GET /api/v1/year-groups/:id
// @acess Private
exports.getYearGroup = AsyncHandler(async (req, res) => {
  const group = await YearGroup.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Year Group fetched succesfully",
    data: group,
  });
});

// @desc Update Year Group
// @route PUT /api/v1/year-groups/:id
// @acess Private
exports.updateYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  //check name exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new Error("Year group already exists");
  }

  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Year Group updated succesfully",
    data: yearGroup,
  });
});

// @desc Delete Year Group
// @route DELETE /api/v1/year-groups/:id
// @acess Private
exports.deleteYearGroup = AsyncHandler(async (req, res) => {
  await YearGroup.findByIdAndDelete(req.params.id);
  await YearGroup.save();
  res.status(201).json({
    status: "success",
    message: "Year Group deleted succesfully",
  });
});
