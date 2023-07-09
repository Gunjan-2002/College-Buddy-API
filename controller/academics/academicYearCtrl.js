const AsyncHandler = require("express-async-handler");
const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Staff/Admin");

// @desc Create Academic Year
// @route POST /api/v1/academic-years
// @acess Private
exports.createAcademicYear = AsyncHandler(async (req, res) => {
  const { name, fromYear, toYear } = req.body;

  // check academic year exist
  const academicYear = await AcademicYear.findOne({ name });

  if (academicYear) {
    throw new Error("Academic year already exist");
  }

  //create
  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    createdBy: req.userAuth._id,
  });

  //push academic yer into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicYears.push(academicYearCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Academic year created succesfully",
    data: academicYearCreated,
  });
});

// @desc Get All Academic Years
// @route GET /api/v1/academic-years
// @acess Private
exports.getAcademicYears = AsyncHandler(async (req, res) => {
  const academicYears = await AcademicYear.find();

  res.status(201).json({
    status: "success",
    message: "Academic years fetched succesfully",
    data: academicYears,
  });
});

// @desc Get Single Academic Years
// @route GET /api/v1/academic-years/:id
// @acess Private
exports.getAcademicYear = AsyncHandler(async (req, res) => {
  const academicYears = await AcademicYear.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic year fetched succesfully",
    data: academicYears,
  });
});

// @desc Update Academic Year
// @route PUT /api/v1/academic-years/:id
// @acess Private
exports.updateAcademicYear = AsyncHandler(async (req, res) => {
  const { name, fromYear, toYear } = req.body;

  //check name exists
  const createAcademicYearFound = await AcademicYear.findOne({ name });
  if (createAcademicYearFound) {
    throw new Error("Academic year already exists");
  }

  const academicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    {
      name,
      fromYear,
      toYear,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Academic year updated succesfully",
    data: academicYear,
  });
});

// @desc Delete Academic Year
// @route DELETE /api/v1/academic-years/:id
// @acess Private
exports.deleteAcademicYear = AsyncHandler(async (req, res) => {
  await AcademicYear.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic year deleted succesfully",
  });
});
