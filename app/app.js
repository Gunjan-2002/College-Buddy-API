// Responsibility of app.js file is to implement some logic like how can we use middleware
const express = require("express");
const morgan = require('morgan');
const {globalErrHandler , notFoundErr } = require("../middlewares/globalErrHandler");
const adminRouter = require("../routes/staff/adminRouter");
const academicYearRouter = require("../routes/academics/academicYear");
const academicTermRouter = require("../routes/academics/academicTerm");
const classLevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/program");
const subjectRouter = require("../routes/academics/subject");
const yearGroupRouter = require("../routes/academics/yearGroup");
const teachersRouter = require("../routes/staff/teachers");
const examRouter = require("../routes/academics/exam");
const studentRouter = require("../routes/staff/student");
const questionRouter = require("../routes/academics/question");
const examResultRouter = require("../routes/academics/examResults");


const app = express();

//Middlewares
app.use(morgan("dev"));
app.use(express.json()); // Pass incoming json data




/* ************************************************************
                TESTING SOME DUMMY MIDDLEWARE

app.use((req , res , next) =>{
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

let user = {
    name:"John Does",
    isAdmin:false,
    isLogin:true,
};

const isLogin = (req , res , next) =>{
    if(user.isLogin)
    {
        next();
    }else{
        res.status(401).json({
            msg:"Unauthorized",
        });
    }   
};

const isAdmin = (req , res , next) =>{
    if(user.isadmin)
    {
        next();
    }else{
        res.status(401).json({
            msg:"Unauthorized , u are not admin",
        });
    }   
};

app.use(isLogin , isAdmin);

**************************************************************** */


//Routes
// .use is used as middleware it can work with all http 
// request means we dont have to mention routes in this file.
//admin register
app.use('/api/v1/admins' , adminRouter);
app.use('/api/v1/academic-years' , academicYearRouter);
app.use('/api/v1/academic-terms' , academicTermRouter);
app.use('/api/v1/class-levels' , classLevelRouter);
app.use('/api/v1/programs' , programRouter);
app.use('/api/v1/subjects' , subjectRouter);
app.use('/api/v1/year-groups' , yearGroupRouter);
app.use('/api/v1/teachers' , teachersRouter);
app.use('/api/v1/exams' , examRouter);
app.use('/api/v1/students' , studentRouter);
app.use('/api/v1/questions' , questionRouter);
app.use('/api/v1/exam-results' , examResultRouter);


// ERROR MIDDLEWARES
app.use(notFoundErr);
app.use(globalErrHandler);


module.exports = app;

// "640f5b66a7e79a1b1b07faea"