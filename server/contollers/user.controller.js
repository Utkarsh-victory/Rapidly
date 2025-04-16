import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageClodinary from "../utils/uploadImageClodinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'


//register contoller
export async function registerUserContoller(request,response) {
    try{
        const { name,email,password}= request.body

        if(!name || !email || !password){
          return response.status(400).json({
            message : "provide email, name, password",
            error : true,
            success : false
          })
        }

        const user = await UserModel.findOne({ email})

        if (user){
          return response.json({
            message : "Already register the email",
            error : true,
            success : false
          })
        }

        const  salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)

        const payload = {
          name,
          email,
          password :  hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verfy-email?code=${save._id}`

        const verifyEmail= await sendEmail({
            sendTO : email,
            subject : "verify email from blinket",
            html : verifyEmailTemplate({
              name,
              url : verifyEmailUrl

            })
        })

            return response.json({
              message : "User register successful",
              error : false,
              success : true,
              data : save
            })
    } catch (error){
        return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
        })
    } 
}

//verfication controller
export async function verifyEmailController(request,response){
  try {
    const {code} = request.body

    const user = await UserModel.findOne({_id : code})
    if (!user){
      return response.status(400).json({
         message : "Invalid code",
         error : true,
         success : false
      })
    }

    const updateUser = await UserModel.updateOne({_id:code},{
      verify_email : true
    })


    return response.json({
      message : "verifcation of Email is done",
      success : true,
      error : false
    })
  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true,
      success : true
    })
  }
}

//login controller

export async function loginController(request,response){

  try {
    const {email, password} = request.body

    if (!email || !password){
      return response.status(400).json({
        message : "Provide email and password",
        error : true,
        success : false
      })
    }

    const user = await UserModel.findOne({ email })
    
    if (!user){
      return response.status(400).json({
        message : "User not register",
        error : true,
        success : false
      })
    }

  if (user.status !== "Active"){
    return response.status(400).json({
      message :  "Connect to Admin",
      error : true,
      success : false
    })
  }

  const checkPassword = await bcryptjs.compare(password,user.password)

  if (!checkPassword){
    return response.status(400).json({
      message  : "Check your password",
      error : true,
      success : false
    })
  }

      const accesstoken = await generatedAccessToken(user._id)
      const refreshToken  = await genertedRefreshToken(user._id)

      const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
        last_login_date : new Date()
      })


      const cookiesOption = {
          httpOnly : true,
          secure : true,
          sameSite : "None" 
      }
  response.cookie('accessToken',accesstoken,cookiesOption)
  response.cookie('refreshToken',refreshToken ,cookiesOption)

        return response.json({
          message : "Login Successfully",
          error : false,
          success : true,
          data :  {
            accesstoken,
            refreshToken
          }
        })

  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

//Logout controller

export async function logoutController(request,response) {
  
  try {
    const userid = request.userId
    const cookiesOption = {
      httpOnly : true,
      secure : true,
      sameSite : "None" 
  }
    response.clearCookie("accessToken",cookiesOption)
    response.clearCookie("refreshToken",cookiesOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
      refresh_token : ""
    })

    return response.json({
      message : "Logout Successfully",
      error : false,
      success : true
    })
  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

//upload use avatar

export async function uploadAvatar(request,response){

  try {
    const userId = request.userId //auth middleware
    const image = request.file // multer middleware

    const upload = await uploadImageClodinary(image)
    
    const updateUser = await UserModel.findByIdAndUpdate(userId,{
      avatar : upload.url
    })
    
    return response.json({
      message : "Upload profile",
      succes : true,
      error : false,
      data : {
        _id : userId,
        avatar : upload.url
      }
    })

  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true ,
      success : false
    })
  }
}


//update user details
export async function updateUserDetails(request,response) {
  
    try {
      const userId = request.userId //auth middleware
      const {name,email,mobile,password} = request.body

      let hashPassword = ""


      if (password){
        const  salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)
      }

      const updateUser = await UserModel.updateOne({_id : userId},{
        ...(name && { name : name}),
        ...(email && { email : email}),
        ...(mobile && { mobile : mobile}),
        ...(password && { password : hashPassword})

      })

      return response.json({
        message : "Update successfully",
        error : false,
        success : true,
        data : updateUser
      })

    } catch (error) {
      return response.status(500).json({
        message : error.message || error,
        error : true,
        success : false
      })
    }
}

//forgot passward not login

export async function forgotPasswordController(request,response) {

  try {
      const { email } = request.body

      const user = await UserModel.findOne({ email })

      if(!user){
        return response.status(400).json({
          message : " Email is not Available ",
          error : true,
          success : false
        })
      }  

      const otp = generatedOtp()
      const expireTime = new Date() + 60 * 60 * 1000 //1hr

      const update = await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_otp : otp,
        forgot_password_expiry : new Date(expireTime).toISOString()
      })
      
      await sendEmail({
        sendTO : email,
        subject : "Forgot password from Blinket",
        html : forgotPasswordTemplate({
          name : user.name,
          otp : otp
        })
          
      })
      
        return response.json({
          message : " check your email ",
          error : false,
          success : true
        })

  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
  
}


//Verify forgot password otp
export async function verifyForgotPassword(request,response){
  
  try {
    const { email , otp } = request.body

    if (!email || !otp){
      return response.status(400).json({
        message : "Provide required field email , otp",
        error : true,
        succes : false
      })
    }
    const user = await UserModel.findOne({ email })

    if(!user){
      return response.status(400).json({
        message : " Email is not Available ",
        error : true,
        success : false
      })
    }  

    const currentTime = new Date().toISOString()

    if(user.forgot_password_expiry < currentTime){
      return response.status(400).json({
        message : "otp expired",
        error : false,
        succes : false
      })
    }


    if(otp!== user.forgot_password_otp){
      return response.status(400).json({
        message : "invalid otp ",
        error : true,
        succes : false
      })
    }


//if otp is not expired 
//otp === user.forgot_password_otp

const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
  forgot_password_otp  : "",
  forgot_password_expiry : "",
})

    return response.json({
      message : " verify otp succesfully",
      error : false,
      success : true
    })

  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true,
      succes : false
    })
  }
}

//reset the password
export async function resetpassword(request,response) {
  

  try {
    const  { email , newpassword , confirmPassword } = request.body

    if (!email || !newpassword || !confirmPassword) {
      return response.status(400).json({
        message : "provide required fields email, newpassword, confirmpassword" 
      })
    }

    const user = await UserModel.findOne({ email })

    if(!user){
      return response.status(400).json({
        message : "Email is not available",
        error : true,
        success : false
      })
    }

    if (newpassword !== confirmPassword){
      return response.status(400).json({
        message : "newpassword and confirmPassword are not same",
        error : true,
        success : false
      })
    }

    const  salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newpassword,salt)

    const update = await UserModel.findOneAndUpdate(user._id,{
      password : hashPassword
    })

    return response.json({
      message : "Password updated successfully",
      error : false,
      success : true
    })

  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true ,
      success : false
    })
  }
}


//refresh token controller 
export async function refreshToken(request,response){
  try {
      const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]///'bearer token'
      
      if (!refreshToken){
        return response.status(401).json({
          message : "invalid token",
          error : true,
          success : false
        })
      }
      const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

      if (!verifyToken){
        return response.status(401).json({
          message : "token is expire",
          error : true,
          succes : false
        })
      } 

      console.log("verifyToken",verifyToken)
      const userId = verifyToken?._id 
      const newAccessToken = await generatedAccessToken(userId)
      
      const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite : "None" 
      }
      response.cookie('accessToken',newAccessToken,cookiesOption)

      return response.json({
        message : "New Access token generated",
        error : false,
        success : true,
        data : {
          accesstoken : newAccessToken
        }
      })

  } catch (error) {
    return response.status(500).json({
      message : error.message || error,
      error : true,
      succes : false
    })
  }
}

// get login user details 
export async function userDetails(request,response) {
  try {
    const userId = request.userId
    console.log(userId)
    const user = await UserModel.findById(userId).select('-password -refresh_token')

    return response.json({ 
      message : "user details",
      data : user,
      error : false,
      success : true
    })
  } catch (error) {
    return response.status(500).json({
      message : "Something is wrong",
      error : true,
      success : false
    })
  }
}