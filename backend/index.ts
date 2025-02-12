import express, {Request, Response, NextFunction} from "express";

const app = express();

const port = process.env.PORT || 4000;

// built-in middleware for json 
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });
  
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });