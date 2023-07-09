const verifyToken = require("../utils/verifyToken");
const Admin = require("../model/Staff/Admin");

const isLogin = async (req, res, next) => {
  //step-1 : get token from header
  const headerObj = req.headers;
  const token = headerObj ?.authorization?.split(" ")[1];

  //step-2 : verify token
  const verifiedToken = verifyToken(token);

  if (verifiedToken) {
    //find the admin
    const user = await Admin.findById(verifiedToken.id).select(
      "name email role"
    );
    // step-3 : save the user into req.obj
    req.userAuth = user;
    // return verifiedToken;
    next();
  } else {
    const err = new Error("Token expired/invalid");
    next(err);
  }
};

module.exports = isLogin;
