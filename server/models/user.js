import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email"
        ]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false
    },

    role: {
        type: String,
        default: "Student",
        enum: ["Student", "Teacher", "Admin"]
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    department: {
        type: String,
        trim: true,
        default: null
    },

    experties: {
        type: [String],
        default: []
    },

    maxStudents: {
        type: Number,
        default: 10,
        min: [1, "Min students must be at least 1"]
    },

    assignedStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    supervisior: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null
    }

},
{
    timestamps: true
}
);


// 🔐 Password Hash Before Save
userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});


// 🔑 Generate JWT Token
userSchema.methods.generateToken = function () {

    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};


// 🔍 Compare Password
userSchema.methods.comparePassword = async function(enteredpassword) {

    return await bcrypt.compare(enteredpassword, this.password);
};


// 🔄 Generate Reset Password Token
userSchema.methods.getResetPasswordToken = function() {

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};


export const User = mongoose.model("User", userSchema);