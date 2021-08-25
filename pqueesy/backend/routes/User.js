const router = require("express").Router();
let User=require("../models/User");
const asyncHandler=require("express-async-handler");
const generateToken = require("../utils/generateToken");

var axios = require('axios');



router.route("/compile").post(asyncHandler(async(req,res)=>{
    const {code,language,input}=req.body;
var data = JSON.stringify({
           "code":code,
           "language":language,
           "input":input
           });

var config = {
  method: 'post',
  url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  res.status(200).send(response.data);
  console.log(response.data)
})
.catch(function (error) {
  console.log(error);
});}));


router.route("/add").post(asyncHandler(async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const first_name=req.body.first_name;
    const last_name=req.body.last_name;
    const userExists=await User.findOne({email});
    if(userExists){
        res.status(200).send({massage:"Already exist"});
       
    }
    else{
    const newUser=new User({
        email,
        password,
        first_name,
        last_name

    })
    newUser.save().then(()=>{
        res.status(200).send({massage:"succesfully created"});
    }).catch((err)=>{
        console.log(err);
    })}
}));

router.route("/login").post(asyncHandler(async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const user=await User.findOne({email});
    console.log(email);
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            email:user.email,
            first_name:user.first_name,
            last_name:user.last_name,
            token: generateToken(user._id)
            
        });
        
       
    }
    else{
        res.status(400).send({massage:"incorrect Email or password"});
    }
}));
module.exports=router;