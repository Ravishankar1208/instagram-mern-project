const jwt = require('jsonwebtoken')
const userModel = require("../models/user.model")

async function identifyUser(req, res, next){
    const token = req.cookies.token

  if(!token){ 
    return res.status(401).json({
  message: "token not provided, unauthorized access"
});
  }
  let decoded = null
try{
      decoded = jwt.verify(token, process.env.JWT_SECRET)
}catch(err){
  return res.status(401).json({
    message:"user not authorized"
  })
}

const user = await userModel
  .findById(decoded.id)
  .select("-password");

if (!user) {
  return res.status(401).json({
    message: "User not found"
  });
}

req.user = user;

next();
 
}

module.exports = identifyUser;