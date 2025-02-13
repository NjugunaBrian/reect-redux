import { Request, Response, NextFunction } from "express"

interface RoleVerificationRequest extends Request {
    roles?: string[];
}

const verifyRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const roleReq = req as RoleVerificationRequest
        if(!roleReq.roles) {
            res.sendStatus(401);
            return;
        }    
        const rolesArray: string[] = [...allowedRoles];
        const hasRole = roleReq.roles.some(role => rolesArray.includes(role));
        
        if(hasRole){
            res.sendStatus(401);
            return;
        }
        next();
    }   
}

export default verifyRoles

{/* 
    use case:
    app.get('/admin', verifyRoles('admin'), (req, res) => {
    res.send('Welcome, admin!');

    the /admin route is protected by the verifyRoles middleware, allowing only users with the 'admin' role to access it.
});
*/}