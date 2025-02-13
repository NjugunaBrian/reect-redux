import express, {Request, Response, NextFunction} from "express";
import connectDB from "./config/dbConn";
import mongoose from "mongoose";
import path from "path";

const app = express();

const PORT = process.env.PORT || 4000;

//connect to MongoDB
connectDB()

// built-in middleware for json 
app.use(express.json());


//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes


app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({ 'error': '404 Not Found'});
    } else {
        res.type('txt').send("404 Not Found");
    }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`⚡️[server]: Server is running on port ${PORT}`))
})  