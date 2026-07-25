const express = require("express")
const postRouter = express.Router()
const postController = require('../controllers/post.controller')
// postRouter.get("/details/:postId",postController.getPostDetails)
const multer = require('multer')

const upload = multer({
  storage: multer.memoryStorage()
})

const identifyUser = require("../middlewares/auth.middlewere")



postRouter.post('/',
  upload.single("chacha"),
  identifyUser,
  postController.createPostController)

 
postRouter.get("/",identifyUser,postController.getPostControllers)

 postRouter.get("/details/:postId",identifyUser,postController.getPostDetails)




postRouter.post("/like/:postId",identifyUser,postController.likePostController)


postRouter.post("/unlike/:postId",identifyUser,postController.unlikePostController)


postRouter.get("/feed",identifyUser,postController.getFeedController)





 
module.exports = postRouter