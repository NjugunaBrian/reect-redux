import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectDB = async () => {

    try{
        await mongoose.connect(process.env.DATABASE_URI!)
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }

}

export default connectDB