const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const { Schema, model } = mongoose;

const userschema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  },
  password: {
    type: String,
    trim:true,
    required:true,
    minLength: 5
   
  }, 
  role: {
    type: String,
    default: "customer",
    enum: ['customer','vendor'] //enum is for validating that the value provided will be of below three array string
  },
  mobile:{
      type:String,
      trim:true,
      unique:true
    }
});

userschema.pre('save', async function (next) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedpassword = await bcrypt.hash(this.password, salt)
      this.password = hashedpassword;
  
      next();
    } catch (error) {
      next(error);
    }
  
  })
//this function has to run manually by calling it 
userschema.methods.isvalid = async function (password) {

    try {
      return await bcrypt.compare(password, this.password)  //returns boolean 
  
    } catch (error) {
      next(error);
  
    }
    return 0;
  
  }

const User = model("User", userschema);
module.exports = User;
