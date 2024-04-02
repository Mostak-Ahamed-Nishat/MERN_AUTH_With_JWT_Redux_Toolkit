import express from "express";
const router = express.Router();
import { authUser } from "../controllers/userController.js";

router.route("/auth").get(authUser);

export default router;
