const postModel = require("../models/post.model");
const ImageKit = require("imagekit");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model")
// const postRouter = require("../routes/post.route");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


async function createPostController(req, res) {

  if (!req.file) {
  return res.status(400).json({
    message: "Image is required"
  });
}

   
 

  const file = await imagekit.upload({
    file: req.file.buffer,
    fileName: req.file.originalname,
      folder:"cohort-2-insta-clone-posts"
  })  

 const post = await postModel.create({
  caption: req.body.caption,
  imgURL: file.url,
  user: req.user.id
});

const populatedPost = await postModel
  .findById(post._id)
  .populate("user", "username profileImage bio email");

return res.status(201).json({
  message: "post created successfully",
  post: populatedPost,
});

  
}


async function getPostControllers(req, res){
  // const token = req.cookies.token



   const userID = req.user.id

   const posts = await postModel.find({
    user: userID
   })

   res.status(200).json({
    message:"post fetched sucessfully",
    posts
   })
  
}

async function getPostDetails(req, res){

  const userId = req.user.id
  const  postId = req.params.postId

  const post = await postModel.findById(postId)

  if(!post){
    return res.status(404).json({
      message:"post not found."
    })
  }

  const isValidUser = post.user.toString()===userId

  if(!isValidUser){
    return res.status(403).json({
      message:"Forbidden Content."
    })
  }

  return res.status(200).json({
    message:"post fetched sucessfully",
    post
  })
}


async function likePostController(req, res){
  const username = req.user.username
  const postId = req.params.postId

  const post = await postModel.findById(postId)

  if(!post){
    return res.status(404).json({
      message:"post not found."
    })
  }

  const alreadyLiked = await likeModel.findOne({
  post: postId,
  user: username
})

if(alreadyLiked){
  return res.status(400).json({
    message:"Post already liked"
  })
}


  const like = await likeModel.create({
    post:postId,
    user : username
  })
  res.status(200).json({
    message:"post liked sucessfully.",
    like
  })
}

async function unlikePostController(req, res) {
  const postId = req.params.postId;
  const username = req.user.username
  
  const isLiked = await likeModel.findOne({
    post:postId,
    user:username
  })

  if(!isLiked){
    return res.status(400).json({
      message:"post didn't like"
    })
  }
 await likeModel.deleteOne({
    post: postId,
    user: username,
});

  return res.status(200).json({
    message:"post unLiked successfully."
  })
}

async function getFeedController(req, res){

  const user = req.user


const posts = await Promise.all(
  (
    await postModel
      .find({})
      .sort({ createdAt: -1 })   // ya _id: -1
      .populate("user", "username profileImage bio email")
      .lean()
  ).map(async (post) => {
    const isLiked = await likeModel.findOne({
      user: user.username,
      post: post._id,
    });

    post.isLiked = Boolean(isLiked);

    return post;
  })
);

  res.status(200).json({
    message:"posts fetched sucessfully.",
    posts
  })
}

module.exports = {
  createPostController,
  getPostControllers,
  getPostDetails,
  likePostController,
  getFeedController,
  unlikePostController
} 

 
