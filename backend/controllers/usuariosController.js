const Usuarios = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Crear usuario
exports.registrarUsuario = async (req, res) => {

    //leer datos del usuario
    const usuario = new Usuarios(req.body);
    usuario.password = await bcrypt.hash(req.body.password, 12);
    try {
        await usuario.save();
        res.json({message : 'Usuario creado correctamente'});
        
    } catch (error) {
        console.log(error)
        res.json({message : 'Hubo un error'});
    }
}

//Autenticar usuario
exports.autenticarUsuario = async (req, res, next) => {
    //Buscar formulario
    const usuario = await Usuarios.findOne({email : req.body.email});
    
    if (!usuario) {
    //Si el usuario no existe
    await res.status(401).json({message : 'Ese usuario no existe'});
    next();

    }else {
        //El usuario existe, verificar contraseña
        if(!bcrypt.compareSync(req.body.password, usuario.password)) {
            //Si el usuario existe pero la contraseña es incorrecta
            await res.status(401).json({message : 'Password Incorrecto'});
            next();
        }else {
            //Contraseña correcta firmar token
            const token = jwt.sign({
                email : usuario.email,
                nombre: usuario.nombre,
                id: usuario._id
            },
            'PRIVATEKEY', {
                expiresIn: '8h'
            });

            //Retornar token
            res.json({token});
        }

    }
}