const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")


const registerUser = async(req , res) => {
    let {name, email , phone , password} = req.body

    if(!name || !email || !phone || !password){
        res.status(400)
        throw new Error("Please Fill All Details")
    }

    // Check if user already exists
    let emailExists = await User.findOne({email:email})
    let phoneExists = await User.findOne({phone:phone})

    if(emailExists || phoneExists){
        res.status(400)
        throw new Error('User Already Exists')
    }

    // Check if phone number is valid
    if(phone.length !==10){
        res.status(400)
        throw new Error('Please enter valid phone number')
    }
 
    // Hash Password
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)

    // Create user 
    let user =  new User({
        name,
        email, 
        phone,
        password: hashedPassword,
       
    })
    const refreshToken=generateRefreshToken(user._id)
    user.refreshToken=refreshToken
    await user.save();

    if(!user) {
        res.status(400)
        throw new Error('User Not Created')
    }

    res.status(201).json({
        _id : user._id,
        name: user.name,
        email : user.email,
        phone : user.phone,
        createdAt : user.createdAt,
        token : generateAccessToken(user._id)
    })

    res.status(201).json(user)
}


// Login User
 const loginUser = async(req , res) => {
    const { email, password} = req.body

    if(!email || !password) {
        res.status(400)
        throw new Error('Please Fill All Details')
    }

    const user = await User.findOne({email})

    const refreshToken = generateRefreshToken(user._id)
    const accessToken = generateAccessToken(user._id)

    user.refreshToken = refreshToken
    await user.save()

  if(user && await bcrypt.compare(password, user.password)){
    res.status(200).json(
{
    name:user.name,
    email:user.email,
    phone:user.phone,    
    createdAt:user.createdAt,
    accessToken : accessToken,
})
  }
  res.status(409).json({
    message:"Invalid Credentials"
  })
   }



   const generateRefreshToken = (id) => {
  let token = jwt.sign({id}, process.env.REFRESH_SECRET, {expiresIn : '7d'})
    return token
   }


 const generateAccessToken = (id) => {
  let token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn : '1m'})
    return token
   }



   //  Refresh token
   const refToken = async(req, res) => {
    try {
        const {refToken} = req.body;
        if(!refToken)
            return res.status(401).json({message:"Refresh Token Required"})

        const user = await User.findOne({refreshToken:refToken})
        if(!user)
            return res.status(403).json({message:"Invalid Refresh Token"})

        jwt.verify(refToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if(err)
                return res.status(403).json({message : "Token Expired"})

            const newAccessToken = generateAccessToken(decoded.id)
            res.json({accessToken: newAccessToken})

        })
        
    } catch (err) {
        res.status(500).json({message: "Server Error"})
    }
   }





   module.exports = {registerUser, loginUser, refToken}