import express from "express";  
import User from "../models/User.js";
import customResponse from "../utilities/response.js";
const router = express.Router(); 
import sendEmail from "../utilities/sendEmail.js";

router.post("/send", async (req, res)=>{
    const {name, to, subject, text, link} = req.body;

  const response = await sendEmail({name, to, subject, text, link}) 
  console.log(response)

    customResponse(res, 200, "Email sent successfully", response);
})



// router.post("/send-top-by-mail", async (req, res)=>{
//     const {name, to, subject, text, link} = req.body;

//   const response = await sendEmail({name, to, subject, text, link}) 
//   console.log(response)

//     customResponse(res, 200, "Email sent successfully", response);
// })

export default router;



// verfication otp

