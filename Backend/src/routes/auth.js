const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utills/validate");



authRouter.post("/signup",async (req, res) => {

  try{
    await validateSignUpData(req, User);
    const {firstName, lastName, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    const user = new User({firstName,lastName,email,password: passwordHash});
    await user.save();
    res.send("User created successfully");
  }
  catch(err){
    res.status(400).send("ERROR: " + err.message);
  }    
});

authRouter.post("/login", async (req, res) => {

try{
    const { email, password } = req.body; 
    const user = await User.findOne({email:email});
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){
      const token = await user.getJWT();
      // console.log("Token:", token);

      res.cookie("token",token);
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout successful");
});

module.exports = authRouter;