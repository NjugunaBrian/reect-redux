import express, { Router } from "express"
import { deleteUser, getAllUsers, getUser } from "../../controllers/usersController";
import verifyRoles from "../../middleware/verifyRoles";
import ROLES_LIST from "../../config/roles_list";

const router:Router = express.Router();

router.route('/')
    .get(getAllUsers as express.RequestHandler)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteUser as express.RequestHandler);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), getUser as express.RequestHandler)    
 
    
export default router    