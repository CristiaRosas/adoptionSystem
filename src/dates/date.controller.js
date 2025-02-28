import User from '../users/user.model.js';
import Date from './date.model.js';

export const saveCita = async (req, res) => {
    const { email, ...data } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Correo electrónico no encontrado en la base de datos'
            });
        }

        const cita = new Date({
            hora: data.hora,
            fecha: data.fecha,
            motivo: data.motivo,
            relacion: user._id,
            status: data.status, 
          });
          
        const savedCita = await cita.save();

        return res.status(200).json({
            success: true,
            cita: savedCita
        });
    } catch (error) {
        console.error('Hubo un error al guardar la cita:', error);
        return res.status(500).json({
            success: false,
            message: 'No se pudo agregar la cita',
            error: error.message || error
        });
    }
};

export const getDates = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true }; 

    try {
        const [total, dates] = await Promise.all([
            Date.countDocuments(query), 
            Date.find(query)
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        return res.status(200).json({
            success: true,
            total,
            dates
        });

    } catch (error) {
        console.error('Error al obtener las citas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener citas',
            error: error.message || error
        });
    }
};
