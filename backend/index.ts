import express from "express";
import connectDB from "./config/dbConn";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { logger } from "./middleware/logEvents";
import credentials from "./middleware/credentials";
import corsOptions from "./config/corsOptions";
import rootRouter from "./routes/root";
import registerRouter from './routes/register';
import authRouter from './routes/auth';
import refreshRouter from './routes/refresh';
import logoutRouter from './routes/logout';
import employeesRouter from "./routes/api/employees";
import usersRouter from "./routes/api/users";
import verifyJWT from "./middleware/verifyJWT";
import errorHandler from "./middleware/errorHandler";

const app = express();

const PORT = process.env.PORT || 4000;

//connect to MongoDB
connectDB()

//custom middleware logger
app.use(logger);

//Handle options credentials check - before CORS! and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);

app.use(verifyJWT);
app.use('/employees', employeesRouter);
app.use('/users', usersRouter);

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

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`⚡️[server]: Server is running on port ${PORT}`))
})  