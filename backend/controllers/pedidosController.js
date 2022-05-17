const Pedidos = require('../models/Pedidos');

//Agrega un nuevo pedido
exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedidos(req.body);

    try {
        await pedido.save();
        res.json({message : 'Se agrego un nuevo pedido'});
    } catch (error) {
        console.log(error);
        next();
    }
}

//Muestra todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto', 
            model: 'Productos'
        });
        res.json(pedidos);

    } catch (error) {
        console.log(error);
        next();
    }
}

//Mostrar un pedido por id
exports.mostrarPedido = async (req, res, next) => {
    const pedido = await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
        path: 'pedido.producto', 
        model: 'Productos'
    });

    if (!pedido) {
        res.json({message : 'Ese pedido no existe'});
        return next();       
    }
    //Mostrar pedido
    res.json(pedido);
}

//Actualizar pedido por id
exports.actualizarPedido = async (req, res, next) => {

    try {
        let pedido = await Pedidos.findOneAndUpdate({_id : req.params.idPedido}, req.body, {
            new: true
        }).populate('cliente').populate({
            path: 'pedido.producto', 
            model: 'Productos'
        });
        res.json(pedido);
    } catch (error) {
        console.log(error);
        return next();
    }
}

//Eliminar un pedido por su id
exports.eliminarPedido = async (req, res, next) => {
    try {
        await Pedidos.findOneAndDelete({_id : req.params.idPedido});
        res.json({message : 'El pedido ha sido eliminado'});
        
    } catch (error) {
        console.log(error);
        next();
    }
}