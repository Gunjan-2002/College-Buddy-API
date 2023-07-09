const mongoose = require('mongoose');

const dbConnect = async() =>{
    try{
        // console.log(process.env);
        await mongoose.connect(process.env.MONGO_URL)
        console.log('DB Connected Succesfully');
    } catch(error){
        console.log("DB Connection failed", error.message);
    }
};

// This will help to directly require module and function will 
// run not like that of export syntax
dbConnect(); 



// lgJZ4OnRBUoJMjtU