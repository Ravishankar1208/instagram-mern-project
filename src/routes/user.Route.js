const express = require("express")
const followUserController =require("../controllers/user.Controller")
const identifyUser =  require("../middlewares/auth.middlewere")

const userRouter = express.Router()

userRouter.post("/follow/:username", identifyUser, followUserController.followUserController)


userRouter.post("/unfollow/:username", identifyUser, followUserController.unfollowUserController)

module.exports = userRouter