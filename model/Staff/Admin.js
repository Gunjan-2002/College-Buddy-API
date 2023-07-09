const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    academicTerms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicTerm",
      },
    ],
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    yearGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "YearGroup",
      },
    ],
    academicYears: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicYear",
      },
    ],
    classLevels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassLevel",
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Two types of middleware pre and post
// pre means before saving document and post means after saving

// Hash Password
// We use normal function because we want to use this keyword and
// arrow function does not support this keyword 

// adminSchema.pre('save' , async function(next){
//   if(!this.isModified('password')){
//     next();
//   }
//   // Salt
  
//   next();
// });

// Verify Password
// Whatever u put up in methods is available to all admin documents

// adminSchema.methods.verifyPassword = async function(enteredPassword){
//   return await bcrypt.compare(enteredPassword , this.password);
// }


//model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
