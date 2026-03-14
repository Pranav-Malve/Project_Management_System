import { connectDB } from "./config/db.js";
import app from "./app.js";
import { connect } from "mongoose";


//--------------------------------------------
//DATABASE CONNECTION
//--------------------------------------------

connectDB();
//--------------------------------------------
//start server
//--------------------------------------------
const PORT = process.env.PORT ||4000;

const server =app.listen(PORT, () => {
    console.log(`sever is running on port ${PORT}`);
});

//--------------------------------------------
//ERROR HANDLING
//--------------------------------------------

process.on("unhandledRejection",(err) => {
    console.error(`Unhandle Rejection: ${err.message}`);
    server.close(()=>process.exit(1));
});


process.on("uncaughtException",(err)=>{
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});


export default server;



