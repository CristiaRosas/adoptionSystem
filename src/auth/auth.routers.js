import { Router } from 'express';
import { check } from 'express-validator';
import { login, register } from './auth.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { esRoleValido, existeEmail } from '../helpers/db-validator.js';

const router = Router();

router.post(
    '/login',
    [
        check('correo', 'Este no es un correo valido').isEmail(),
        check('password', 'el password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post(
    '/register',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser mayor a 6 caracteres').isEmpty({min: 6}),
        check('correo', 'Este no es un correo valido').isEmpty(),
        check('correo').custom(existeEmail),
        check('role').custom(esRoleValido),
        check('phone', 'el telefono debe tener 8 numeros').isLength({min: 8, max:8}),
        validarCampos
    ],
    register
)

export default router;