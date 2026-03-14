import express from "express";
import { 
    createStudent,
    deleteStudent,
    updateSudent as updateStudent,
}from "../controllers/admincontroller.js";
import multer from "multer";
import { 
    isAuthenticated,
    isAuthorized,
    

 } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post(
    "/create-student",
    isAuthenticated,
    isAuthorized("Admin"),
    createStudent
);
router.put(
    "/update-student",
    isAuthenticated,
    isAuthorized("Admin"),
    updateStudent
);
router.delete(
    "/delete-student",
    isAuthenticated,
    isAuthorized("Admin"),
    deleteStudent
);

export default router;