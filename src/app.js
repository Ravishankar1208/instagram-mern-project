const express = require('express')
const cookieParser = require("cookie-parser")

const cors = require("cors")
const path = require("path");

const app =  express()



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json())  
app.use(cookieParser())



const authRouter = require('./routes/auth.route')
const postRouter = require('./routes/post.route')
const userRouter = require("./routes/user.Route")


app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/user", userRouter)

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});


module.exports = app;