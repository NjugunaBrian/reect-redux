import express, { RequestHandler } from "express"
import { handleLogin } from "../controllers/authController";

const router = express.Router();

router.post('/', handleLogin as RequestHandler)

export default router