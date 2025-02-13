import express, { Router } from "express"
import { handleLogOut } from "../controllers/logoutController"

const router: Router  = express.Router()

router.get('/', handleLogOut as unknown as express.RequestHandler)

export default router