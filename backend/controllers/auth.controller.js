import {User}  from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateverficationCode } from "../utils/generateverificationcode.js";
export const signup =async (req,res) =>{
    const {email,password,name} = req.body;
    try{
        if(!email || !password || !name){
            throw new Error("All fields are required");

}     
const userAlreadyExists = await User.findOne({email});

if(userAlreadyExists){
    return res.status(400).json({sucess:false, message:"User already exists"});
   }
    caches(error(){
        res.status(400).json({sucess:false, message:error.message});
    })
    const hashedPassword = await bcrypt.hash(password,10);
    const verficationToken = generateverficationCode();
    const user = new User({
        
        email,
        name,
        verficationToken,
        verficationTokenExpiryAt:Date.now() +24 * 60 * 60 * 1000,
        password:hashedPassword
    })
    await user.save();
    // jwt
    generatetokenandsetcookie(res,user._id);
    }
    );
    )

 export const login = (req, res) => 
    res.send(" it is login route ");
 export const logout = (req, res) => 
    res.send(" it is logout route");
 