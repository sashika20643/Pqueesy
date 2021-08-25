const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cors=require("cors");
const dotenv=require("dotenv");
const app=express();
require("dotenv").config();
const {notFound, errorHandler}=require("./middlewares/errorMiddleware");


const PORT= process.env.PORT || 8070;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
//app.use(notFound);
//app.use(errorHandler);
const URL=process.env.MonGoDB_URL;

mongoose.connect(URL,{
useCreateIndex:true,
useNewUrlParser:true,
useUnifiedTopology:true,
useFindAndModify:true

});


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
const connection= mongoose.connection;
connection.once("open",()=>{
    console.log("Mongodb Connection successfull");
});

const userRouter=require("./routes/User.js");
app.use("/user",userRouter);
app.listen(PORT,()=>{
    console.log('Running on port ${PORT}');
});