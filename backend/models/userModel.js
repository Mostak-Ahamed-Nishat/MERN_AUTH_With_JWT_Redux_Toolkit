// This file contains the user model definition.
// It includes attributes and methods related to user data and interactions within the system.

import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Check the user password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('user', userSchema);
export default User;