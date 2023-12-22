import express from "express";  
import User from "../models/User.js";
import customResponse from "../utilities/response.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import checkLogin from "../middleware/checkLogin.js";
import parser from "../utilities/uploadToCloudinary.js";
import awsUpload from "../utilities/uploadToAws.js";
import sendEmail from "../utilities/sendEmail.js";

import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authRouter = express.Router();  

const generateOtp = () => {
    let otp = "";
    // let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for(let i=0;i<6;i++){
        otp += Math.floor(Math.random()*10);
    }
    return otp;

}



// signup:
// authRouter.post("/signup", (req, res)=>{
//     const {name, email, password, phone} =  req.body

//     // basic checks: 

//     if(!name || !email || !password || !phone){
//         return customResponse(res, false, "Please fill all the fields", null)
//     }
//     // all databases related oprations are async

//     // check if user already exists:
//      User.findOne({email: email})
//      .then(
//         (foundUser) => {
//               if(foundUser==null){

//                 // hash the password:
//                 bcrypt.hash(password, 10)
//                 .then(hashedPassword=> {
//                     const newUser =  new User({
//                         name, email, password: hashedPassword, phone
//                      })
//                     newUser.save()
//                     .then(
//                         (nUser) => {
//                             console.log(nUser)
//                             customResponse(res, true, "User registered successfully", nUser)}
//                     ) 
//                     .catch(err => console.log(err))
//                 })
//                 .catch(
//                     err => console.log(err)
//                 )
//               }
//             else{
//                     return customResponse(res, false, "User already exists", null)
//             }
//         }
//      ) 
//      .catch(err => console.log(err))

// })

authRouter.post("/upload",parser.single('xyz'), async (req, res)=>{
       console.log("I am here")
        console.log("link",req.file.path)
        res.json(req.file.path);
})

authRouter.post("/uploadMany",parser.array('xyz', 5), async (req, res)=>{
    let linkArr = []  
    for(let i=0;i<req.files.length;i++){
        linkArr.push(req.files[i].path)
    }
    res.json(linkArr);
})


authRouter.post("/uploadManySingly",parser.fields([{name:"image1", maxCount: 1},{name:"image2", maxCount: 1}, {name:"image3", maxCount: 1} ]),  async (req, res)=>{
    
    // req.files["image1"][0].path 
    // req.files["image2"][0].path
    // req.files["image3"][0].path

    res.json({image1: req.files["image1"][0].path, image2: req.files["image2"][0].path, image3: req.files["image3"][0].path});
    
})

authRouter.post("/uploadToS3",awsUpload.single('img'), async (req, res)=>{
       res.json(req.file.location);
})




authRouter.post("/signup", async (req, res)=>{
    const {name, email, password, phone} =  req.body 

    if(!name || !email || !password || !phone){
        return customResponse(res,400,false, "Please fill all the fields", null)
    }
    try{
       const foundUser = await User.findOne({email: email})
       if(foundUser == null){
           
        // hash the password:
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name, email, password:hashedPassword, phone
        })  
        const nUser = await newUser.save() 
        if(nUser){
            let token = uuidv4();
            nUser.token = token;
            let updatedUser = await nUser.save();
            // send email:
            // let otp = generateOtp();
            // nUser.verificationCodeEmail = otp;
            await nUser.save();

           let email_token = uuidv4();
           nUser.verificationTokenEmail = email_token;

           const verification_url = `https://4vzhs7kk-5000.inc1.devtunnels.ms/api/auth/verify-email-by-link?token=${email_token}`

           await nUser.save();

            sendEmail({
                name: nUser.name,
                to: nUser.email,
                subject: "Welcome to our website. Please Verify Your Email",
                link: verification_url,
            })
            return customResponse(res,200, true, "User registered successfully", updatedUser)
        }
       }
        
       else{
        return customResponse(res,400, false, "User already exists", null)
       }

    }

    catch(err){
        customResponse(res,500, false, "Something went wrong", null)
    }
    
              
})


authRouter.post("/verify-email",checkLogin,  async (req, res)=>{
    const {otp} = req.body
    if(!otp){
        return customResponse(res,400, false, "Please fill all the fields", null)
    }
   
    let savedOtp = req.user.verificationCodeEmail;
    try{
        if(savedOtp == otp){
            req.user.verificationCodeEmail = null;
            let updatedUser = await req.user.save();
            return customResponse(res,200, true, "Email verified successfully", updatedUser)
        }
    }
    catch(err){
        customResponse(res,500, false, "Something went wrong", null)
    }
    
})



authRouter.get("/verify-email-by-link",  async (req, res)=>{
    let email_token = req.query.token;
    console.log(email_token)
    if(!email_token){
        return customResponse(res,400, false, "Please provide token", null)
    }
    try{
    const foundUser = await User.findOne({verificationTokenEmail: email_token})
      if(foundUser == null){
            return customResponse(res,400, false, "Invalid token", null)
      }
        foundUser.verificationTokenEmail = null;
        let updatedUser = await foundUser.save();
        // return customResponse(res,200, true, "Email verified successfully", updatedUser)
        // res.sendFile("../templates/successPage.html")
        res.sendFile(path.join(__dirname, "..", "templates", "successPage.html"))
    }
    catch(err){
        customResponse(res,500, false, "Something went wrong", null)
    }
})


authRouter.post("/login", async (req, res)=>{

    const {email, password} = req.body

    if(!email || !password){
        return customResponse(res,400, false, "Please fill all the fields", null)
    }
    try{
        const foundUser = await User.findOne({email:email}) 
        if(foundUser == null){
            return customResponse(res,400, false, "User does not exist", null)
        }
        // check hashed password:
       const isMatch = await bcrypt.compare(password, foundUser.password)
       if(isMatch){
        let token = uuidv4();
        foundUser.token = token;
        let updatedUser = await foundUser.save();
           return customResponse(res,200, true, "User logged in successfully",  updatedUser)
       }
       else{
            return customResponse(res,400, false, "Invalid credentials", null)
        }
    }

    catch(err){
        customResponse(res,500, false, "Something went wrong", null)
    }
    
    
})



authRouter.get("/secret1",checkLogin, async (req, res)=>{
     customResponse(res,200, true, "Bhargav is working with Raw", req.user)
})


authRouter.get("/secret2", async (req, res)=>{
    const {token} = req.headers
      if(!token){
          return customResponse(res, false, "Please provide token", null)
      }
      const foundUser = await User.findOne({token: token})
      if(foundUser == null){
          return customResponse(res, false, "Invalid token", null)
      }
      customResponse(res,200, true, "Bhargav is working with Raw", null)
})


authRouter.post("/send-otp", async (req, res)=>{
      let otp = "1234"

      const {email} = req.body
        if(!email){
            return customResponse(res, false, "Please provide email", null)
        }
      const foundUser =  await User.findOne({email: email})

      if(foundUser == null){
          return customResponse(res, false, "User does not exist", null)
      }
      foundUser.verificationCode = otp; 
      
    let updatedUser = await foundUser.save();



      // send the code to phone number:

    customResponse(res,200, true, "OTP sent successfully", updatedUser)
})


authRouter.patch("/verify-otp", async (req, res)=>{
    const {otp, newPassword, email} = req.body

    if(!otp || !newPassword || !email){
        return customResponse(res, false, "Please fill all the fields", null)
    }
    const foundUser = await User.findOne({email: email})

    if(foundUser == null){
        return customResponse(res, false, "User does not exist", null)
    }

    let savedOtp = foundUser.verificationCode;
    if(savedOtp == otp){
         // hash the password:
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            foundUser.password = hashedPassword;
            foundUser.verificationCode = null;
            let updatedUser = await foundUser.save();
            return customResponse(res,200, true, "Password updated successfully", updatedUser)
    }
    else{
        return customResponse(res,400, false, "Invalid OTP", null)
    }
})


authRouter.get("/logout", checkLogin, async (req, res)=>{})

authRouter.patch("reset-password", async (req, res)=>{})


export default authRouter;