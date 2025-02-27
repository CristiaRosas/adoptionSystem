import { Router } from "express";
import { check } from "express-validator";
import { saveCita, getDates} from "./date.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check('email', 'El correo es invalido').not().isEmpty(),
        validarCampos
    ],
    saveCita
)

router.get ("/", getDates)

export default router;