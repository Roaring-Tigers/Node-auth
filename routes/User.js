import express from "express";  
import User from "../models/User.js";


const authRouter = express.Router();  



// signup:


authRouter.post("/signup", (req, res)=>{
    const {name, email, password, phone} =  req.body

    // basic checks: 

    if(!name || !email || !password || !phone){
        return res.json({error: "Please fill all the fields"})
    }
    // all databases related oprations are async

    // check if user already exists:
     User.findOne({email: email})
     .then(
        (foundUser) => {
              if(foundUser==null){
                  
                 const newUser =  new User({
                    name, email, password, phone
                 })
                newUser.save()
                .then(
                    () => res.json({message: "User saved successfully"})
                ) 
                .catch(err => console.log(err))




              }
            else{
                    return res.json({message: "User already exists"})
            }
        }
     ) 
     .catch(err => console.log(err))

})


authRouter.post("/login", (req, res)=>{})


export default authRouter;