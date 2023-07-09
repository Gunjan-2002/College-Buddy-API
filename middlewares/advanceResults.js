//model,populate

const advanceResults = (model , populate) =>{
    return (req , res , next)=>{
        console.log("Advance results middleware");
        //add user into the res
        res.myData = {
            name: "Emma",
        };
        next();
    };
};

module.exports = advanceResults;