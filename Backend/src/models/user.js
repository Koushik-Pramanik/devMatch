const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 50
  },
  lastName: { 
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email format" + value);
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol");
      }
    }
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    validate(value) {
      if(!["male", "female", "other"].includes(value.toLowerCase())) {
        throw new Error("Gender must be either male, female, or other");
      }
    }
  },
  photoUrl: {
    type:String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid URL format" + value);
      }
    }
  },
  about:{
    type: String,
    default:"This is a default about of the user"
  },
  skills: {
    type: [String],
    validate(value) {
      if(value.length > 20) {
        throw new Error("Skills should not exceed 20");
      } 
    }
  }
},
  { timestamps: true}
);

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({_id:user._id}, "Dev@Tinder$790", {expiresIn: "7d"});
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid =  await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);