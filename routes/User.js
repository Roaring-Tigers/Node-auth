import express from "express";  
import User from "../models/User.js";
import customResponse from "../utilities/response.js";
import bcrypt from "bcrypt";


const authRouter = express.Router();  



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

authRouter.post("/signup", async (req, res)=>{
    const {name, email, password, phone} =  req.body 

    if(!name || !email || !password || !phone){
        return customResponse(res, false, "Please fill all the fields", null)
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
            return customResponse(res, true, "User registered successfully", nUser)
        }
       }
        
       else{
        return customResponse(res, false, "User already exists", null)
       }

    }

    catch(err){
        console.log(err)
    }
    
              
})


authRouter.post("/login", async (req, res)=>{

    const {email, password} = req.body

    if(!email || !password){
        return customResponse(res, false, "Please fill all the fields", null)
    }
    try{
        const foundUser = await User.findOne({email:email}) 
        if(foundUser == null){
            return customResponse(res, false, "User does not exist", null)
        }
        // check hashed password:
       const isMatch = await bcrypt.compare(password, foundUser.password)
       if(isMatch){
           return customResponse(res, true, "User logged in successfully", foundUser)
       }
       else{
            return customResponse(res, false, "Invalid credentials", null)
        }
    }

    catch(err){
        console.log(err)
    }
    
    




})


export default authRouter;