const Clientes = require('../models/Clientes');

//Agregar nuevo cliente
exports.nuevoCliente = async(req, res, next) => {
    const cliente = new Clientes(req.body);

    try {
        //Almacenar el registro
        await cliente.save();
        res.json({message : 'Se agrego un nuevo cliente'});

    } catch (error) {
        //En caso de ocurrir un error
        res.send(error);
        next();
        
    }
}

//Mostrar todos los clientes
exports.mostrarClientes = async(req, res, next) => {
    try {
        const clientes = await Clientes.find({});
        res.json(clientes);

    } catch (error) {
        console.log(error);
        next();
    }
}

//Mostrar un cliente por su id
exports.mostrarCliente = async(req, res, next) => {
    const cliente = await Clientes.findById(req.params.idCliente);

    if (!cliente) {
        res.json({message : 'No existe este cliente'});
        next();
    }
    //Mostrar cliente
    res.json(cliente);
}

//Actualizar un cliente por su id
exports.actualizarCliente = async(req, res, next) => {
    try {
        const cliente = await Clientes.findByIdAndUpdate({_id : req.params.idCliente}, 
            req.body, {
                new: true // guarda nuevo valor
            });
            res.json(cliente);
        
    } catch (error) {
        res.send(error);
        next();
    }
}

//Eliminar cliente por su id
exports.eliminarCliente = async(req, res, next) => {
    try {
        await Clientes.findOneAndDelete({_id : req.params.idCliente});
        res.json({message : 'El cliente se ha eliminado'});
    } catch (error) {
        console.log(error);
        next();
    }
}