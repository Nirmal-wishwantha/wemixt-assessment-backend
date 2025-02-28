const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
 
  phoneNumber: {
    type: String,
    match: [/^\+947[0-9]{7}$/, "Phone number must follow the format +9471XXXXXXX"],
  },
  address: {
    type: String,
  },
  profilePicture: {
    type: String,
    validate: {
      validator: function (value) {
       
        return true;
      },
      message: "Profile picture exceeds the maximum size of 2MB",
    },
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    
  },
  bio: {
    type: String,
    maxlength: 200,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
