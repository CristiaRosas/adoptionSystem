import jwl from 'jsonwebtoken';

const generarJWT = (uid = '') => {
    return new Promise((resolver, reject) => {

        const payload = { uid };

        jwt.sing(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                err? (console.log(err), reject('No se pudo generar el token')) : resolver(token);
            }

        );
    });
}