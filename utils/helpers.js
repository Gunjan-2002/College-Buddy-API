const bcrypt = require("bcryptjs");

// hash password
exports.hashPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password , salt);
    return hash;
};

// verify password
exports.isPassMatched = async (password, hashPass) =>{
    return await bcrypt.compare(password,hashPass);
};