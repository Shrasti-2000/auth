const {mongoose} = require('mongoose')

const userSchema = new mongoose.Schema({

    name:{
        type : String,
        required : [true, "Please Provide Name "]
    },

      email:{
        type : String,
        unique: true,
        required : [true, "Please Provide Email "]
    },

      phone:{
        type : String,
        unique: true,
        required : [true, "Please Provide Number "]
    },

      password:{
        type : String,
        required : [true, "Please Provide Password "]
    },
    refreshToken:{
        type : String,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)