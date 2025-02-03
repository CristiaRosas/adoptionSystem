import { Router } from "express";
import { login, register } from "./auth.controller.js";
import {registerValidator, loginValidator} from "../middlewares/validator.js"
import { uplpadProfilePicture } from "../middlewares/multer-upload.js";
import { deleteFileOnError } from "../middlewares/deleteFIleOnError.js";

const router = Router();

router.post(
    '/login',
    loginValidator,
    login
);

router.post(
    '/register',
    uplpadProfilePicture.single("profilePicture"),
    registerValidator,
    deleteFileOnError,
    register
);

export default router;