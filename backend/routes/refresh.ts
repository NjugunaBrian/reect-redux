import express, { Router } from "express"
import { handleRefreshToken } from "../controllers/refreshTokenController";

const router: Router = express.Router();


router.get('/', handleRefreshToken as express.RequestHandler);

export default router