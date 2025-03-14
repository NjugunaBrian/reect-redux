import { Response, Request } from "express";
import Employee from "../models/Employee";


export const getAllEmployees = async (req: Request, res: Response) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': "No employees found." });
    res.json(employees);
}

export const createNewEmployee = async (req: Request, res: Response) => {
    if(!req?.body?.firstname || !req?.body?.lastname) { 
        return res.status(400).json({ 'message': "First and last names are required." });
    }
    
    try {
       const result = await Employee.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname
       }) 
       res.status(201).json(result);

    } catch (error: any){
        console.error(error.message);

    }
}

export const updateEmployee = async (req: Request, res: Response) => {
    if(!req?.body?.id) {
        return res.status(400).json({ 'message': "ID parameter is required." });
    }

    const employee  = await Employee.findOne({ _id: req.body.id }).exec();
    if(!employee){
        return res.status(204).json({ 'message': `No employee matched ID ${req.body.id}.` });
    }
    if(req.body?.firstname) employee.firstname = req.body.firstname;
    if(req.body?.lastname) employee.lastname = req.body.lastname;
    const result  = await employee.save();
    res.json(result);
}   

export const deleteEmployee = async (req: Request, res: Response) => {
    if(!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID is required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne();
    res.json(result);
}

export const getEmployee = async (req: Request, res: Response) => {
    if(!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });
    
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if(!employee){
        return res.status(204).json({ 'message': `No employee matches ID ${req.params.id}.` });
    }
    res.json(employee);

}