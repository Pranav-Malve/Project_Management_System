import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User} from "../models/user.js";
import * as userServices from "../services/userService.js";

export const createStudent = asyncHandler (async (req, res, next) => {
    const {name, email, password, department } = req.body;
    if(!name || !password || !department){
        return next(new ErrorHandler("Please provide all required fields",400));
    }
    const user = await userServices.createUser({ 
        name,
        email,
        password,
        department,
        role:"Student",
    });
    res.status(201).json({
        success:true,
        message:"Student created successfully",
        data:{ user },
    });
});

export const updateSudent = asyncHandler(async (req,res,next)=>{
    const { id } = req.param;
    const updateData = { ...req.body };
    delete updateData.role; //Prevent role update

    const user = await userServices.updateUser(id, updateData);
    if(!user){
        return next(new ErrorHandler("Student not Found",404));
    }

    res.status(200).json({
        success:true,
        message:"Student update successfully",
        data:{ user },
    });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
    const { id } =req.params;
    const user = await userServices.getUserById(id);
    if(!user){
        return next(new ErrorHandler("Student not found",404));
    }
    if(user.role !== "Student"){
        return next(new ErrorHandler("Student not Student",400));
    }
    await userServices.deleteUser(id);
    res.status(200).json({
        success : true,
        message : "Student delete Successfully",
    });
});
