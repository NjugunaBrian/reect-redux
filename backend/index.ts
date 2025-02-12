import express, {Request, Response, NextFunction} from "express";
import connectDB from "./config/dbConn";
import mongoose from "mongoose";

const app = express();

const PORT = process.env.PORT || 4000;

//connect to MongoDB
connectDB()

// built-in middleware for json 
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`⚡️[server]: Server is running on port ${PORT}`))
})  