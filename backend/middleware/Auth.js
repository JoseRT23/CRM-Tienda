const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    //Autorizacion del header
    const authHeader = req.get('Authorization');
    console.log(authHeader)

    if(!authHeader) {
        const error = new Error('No autenticado, no hay JWT');
        error.statusCode = 401;
        throw error;
    }

    //Obtener token y verificarlo
    const token = authHeader.split(' ')[1];
    let revisarToken = jwt.verify(token, 'PRIVATEKEY')
        try {
            
        } catch (error) {
            error.statusCode = 500;
            throw error;
        }

    //Token valido pero hay error
    if (!revisarToken) {
        const error = new Error('No autenticado');
        error.statusCode = 401;
        throw error;
    }

    next();
}