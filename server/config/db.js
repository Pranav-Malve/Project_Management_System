import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.
    connect(process.env.MONGO_URI, {
    dbName:"fyp_managment_system"
}).
then(()=>{
    console.log("connect to database.")
}).
catch(err=>{
    console.log("database connection falied.",err)
});
};

