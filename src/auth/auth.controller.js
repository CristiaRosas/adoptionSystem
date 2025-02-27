import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = await Usuario.findOne({ $or: [{ email }, { username }] });

        if (!user || !user.estado) {
            return res.status(400).json({ msg: 'Credenciales incorrectas o usuario no encontrado' });
        }

        if (!await verify(user.password, password)) {
            return res.status(400).json({ msg: ' has ingresado una contraseña incorrecta' });
        }

        res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            userDetails: {
                username: user.username,
                token: await generarJWT(user.id),
                profilePicture: user.profilePicture
            }
        });
    } catch (e) {
        res.status(500).json({ message: 'Hubo un error del servidor', error: e.message });
    }
};



export const register = async (req, res) => {
    try {
        const { name, surname, username, email, phone, password, role } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "La contraseña es un campo obligatorio"
            });
        }

        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(password); 

        const user = await Usuario.create({
            name,
            surname,
            username,
            email,
            phone,
            password: encryptedPassword,
            role,
            profilePicture
        });

        return res.status(201).json({
            message: "Usuario registrado exitosamente!",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Hubo un error en el registro del usuario",
            error: error.message
        });
    }
};
