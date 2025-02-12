import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{type:String,
        required:true,
        unique:true},
    password:{type:String,
        required:true},
name:{type:String,
    required:true},

    lastLogin:{type:Date,
        default:Date.now
    },
    isVerified:{type:Boolean,
        default:false
    },
  restPasowrdToken:String,
  restPasowrdTokenExpiryAt:Date,
  verficationToken:String,
verficationTokenExpiryAt:Date
},{timestamps:true});

export default mongoose.model("User",userSchema);