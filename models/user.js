const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,    //Normalize before saving
        trim: true  //Strips accidental white space
    },

    password: {
        type: String,
        required: true
    },

    fullName: {
        type: String,
        default: null
    },

    department: {
        type: String,
        enum: ['IT', 'HR'],
        default: null
    },

    empId: {
        type: Number,
        default: null
    },

    phone: {
        type: String,
        default: null
    },

    roles: {
        type: [Number],
        default: [2001],
        enum: [5150, 1984, 2001, 5050, 5005]
    },

    refreshToken: {
        type: String,
        default: null
    }
    
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User