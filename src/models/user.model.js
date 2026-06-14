const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    unique : [true, "User name already exists"],
    required : [true,'User name is required']
  },
  email : {
    type : String,
    unique : [true, "email name already exists"],
    required : [true,'email  is required']
  },
  password : {
    type : String,
    required : [true, " password is required"]
  },
  bio:String,
  profileImage: {
    type: String,
    default : 'https://www.kindpng.com/imgv/iwoxbb_user-profile-default-image-png-clipart-png-download/'
  }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel