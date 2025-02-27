import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const usuariosActivos = { estado: true };

        const totalUsuarios = await User.countDocuments(usuariosActivos);
        const listaUsuarios = await User.find(usuariosActivos)
            .skip(Number(desde))
            .limit(Number(limite));

        res.status(200).json({
            success: true,
            total: totalUsuarios,
            users: listaUsuarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Hubo un error al obtener usuarios",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ success: false, msg: "No se pudo encontrar el usuario" });
        }

        res.status(200).json({ success: true, user: usuario });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un error al obtener usuario", error });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password, email, ...datosActualizados } = req.body;

        const usuarioActualizado = await User.findByIdAndUpdate(id, datosActualizados, { new: true });

        res.status(200).json({ success: true, msg: "Usuario actualizado con exito!", user: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un error al actualizar usuario", error });
    }
};

export const updatePassword = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, msg: "La contraseña es obligatoria" });
        }

        const nuevaContraseña = await hash(password);
        await User.findByIdAndUpdate(id, { password: nuevaContraseña });

        res.status(200).json({ success: true, msg: "Actualizacion de contraseña exitoso!" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un problema al actualizar la contraseña", error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const usuarioDesactivado = await User.findByIdAndUpdate(req.params.id, { estado: false }, { new: true });

        if (!usuarioDesactivado) {
            return res.status(404).json({ success: false, msg: "No se logro encontrar el usuario" });
        }

        res.status(200).json({ success: true, msg: "Desactivacion de usuario exitosa!", user: usuarioDesactivado });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un error al desactivar usuario", error });
    }
};