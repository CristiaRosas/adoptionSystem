import User from '../users/user.model.js'
import Date from './date.model.js'

export const saveCita = async (req, res) => {
    try {
        const data = req.body;

        const user = await User.findOne({email: data.email});
        
        if(!user){
            return res.status(404).json({
                succes: false,
                message: 'Email no encontrado'
            })
        }

        const cita = new Date({
            ...data,
            keeper: user._id
        });

        await cita.save();

        res.status(200).json({
            succes: true,
            cita
        });


    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "No se pudo agregar la cita",
            error
        })
    }
}
