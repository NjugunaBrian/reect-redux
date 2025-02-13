import express from "express"
import { createNewEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee } from "../../controllers/employeesController"
import verifyRoles from "../../middleware/verifyRoles"
import ROLES_LIST from "../../config/roles_list"

const router = express.Router()

router.route('/')
    .get(getAllEmployees as express.RequestHandler)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee as express.RequestHandler)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee as express.RequestHandler)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee as express.RequestHandler);

router.route('/:id')
    .get(getEmployee as express.RequestHandler)
    
export default router    