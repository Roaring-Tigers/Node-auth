


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


// async function hello() {
//     try{
//             const response = await axios.get("http://localhost:5000/api/auth/signup")
//             console.log(response)
//     }
//     catch(err){
//         console.log(err)
//     }
       
// }