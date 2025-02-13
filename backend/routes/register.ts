import express, { RequestHandler } from "express"
import { handleNewUser } from "../controllers/registerController";

const router = express.Router();

router.post('/', handleNewUser as RequestHandler)

export default router