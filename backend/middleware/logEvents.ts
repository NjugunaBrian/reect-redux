import { NextFunction, Request, Response } from "express";
import { format } from "date-fns";
import path from "path";
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { promises as fsPromises } from 'fs';



const logEvents = async (message: string, logName: string) => {

    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem =  `${dateTime}\t${uuid()}\t${message}\n`;

    try{
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs', logName), logItem)
        }

    } catch (error: any){
        console.log(error)
    }

}

const logger = (req: Request, res: Response, next: NextFunction) => {
    logEvents(`${req.method}\t${req.headers['origin']}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`)
    next();
}

export { logger, logEvents };
