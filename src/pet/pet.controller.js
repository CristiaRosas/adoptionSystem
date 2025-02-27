import User from '../users/user.model.js';
import Pet from './pet.model.js';

export const savePet = async (req, res) => {
    try {
        const { email, ...data } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: 'Propietario no encontrado' });

        const pet = await Pet.create({ ...data, keeper: user._id });

        res.status(200).json({ success: true, pet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al guardar mascota', error });
    }
};

export const getPets = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, pets] = await Promise.all([
            Pet.countDocuments(query),
            Pet.find(query).skip(Number(desde)).limit(Number(limite)).populate('keeper', 'nombre')
        ]);

        res.status(200).json({ success: true, total, pets });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener mascotas', error });
    }
};

export const searchPet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('keeper', 'nombre');

        if (!pet) return res.status(404).json({ success: false, message: 'Mascota no encontrada' });

        res.status(200).json({ success: true, pet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al buscar mascota', error });
    }
};

export const deletePet = async (req, res) => {
    try {
        await Pet.findByIdAndUpdate(req.params.id, { status: false });
        res.status(200).json({ success: true, message: 'Mascota eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar mascota', error });
    }
};

export const updatePet = async (req, res) => {
    try {
        const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({ success: true, message: 'Mascota actualizada con éxito!', pet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la mascota!', error });
    }
};
