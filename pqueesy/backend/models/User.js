const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const Schema =mongoose.Schema;
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    }
});

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);


});

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

const User=mongoose.model("User",userSchema);
module.exports=User;