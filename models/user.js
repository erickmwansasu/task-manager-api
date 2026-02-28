const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
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
        default: null
    },

    empId: {
        type: Number,
        default: null
    },

    phone: {
        type: Number,
        default: null
    },

    roles: {
        type: [Number],
        default: [2001],
        enum: [5150, 1984, 2001]
    },

    refreshToken: {
        type: String,
        default: null
    }
    
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User