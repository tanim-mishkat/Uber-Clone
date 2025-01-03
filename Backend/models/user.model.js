const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JsonWebTokenError = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters long"]
        },
        lastname: {
            type: String,
            minlength: [3, "Last name must be at least 3 characters long"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 3 characters long"]
    },
    password: {
        type: String,
        required: true,
        select: false, // By default, don't include the password field in queries (for security reasons)
    },
    socketId: {
        type: String,
    },
});

// Instance method to generate an authentication token for the user
userSchema.methods.generateAuthToken = function () {
    // Create a JWT token with the user's _id as the payload and secret key from environment variables
    const token = JsonWebTokenError.sign({
        _id: this._id,  // Attach user _id to the token payload
    }, process.env.JWT_SECRET);  // Sign the token with a secret key from environment variables
    return token;  // Return the generated token
}

// Instance method to compare a given password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
    // Use bcrypt to compare the plain password with the hashed password in the database
    return await bcrypt.compare(password, this.password);
}

// Static method to hash a given password before storing it in the database
userSchema.statics.hashPassword = async function (password) {
    // Use bcrypt to hash the password with a salt round of 10
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
