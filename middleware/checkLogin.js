import customResponse from "../utilities/response.js";
import User from "../models/User.js"

const checkLogin = async (req, res, next) => {
      const {token} = req.headers; 

      if(!token){
            return customResponse(res, false, "Please provide token", null)
      }
      
      const foundUser = await User.findOne({token: token})

        if(foundUser == null){
                return customResponse(res, false, "Invalid token", null)
        }

        req.user = foundUser;

        next()

}

export default checkLogin;