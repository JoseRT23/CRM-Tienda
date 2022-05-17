const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController')
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const usuariosController = require('../controllers/usuariosController');

//Midleware para proteger rutas
const auth = require('../middleware/Auth');

module.exports = function() {

    /**CLEINTES */
    //Agregar clientes via POST
    router.post('/clientes', auth, clienteController.nuevoCliente);

    //Obtener clientes via GET
    router.get('/clientes', auth, clienteController.mostrarClientes);

    //Mostrar un cliente en especifico
    router.get('/clientes/:idCliente', auth, clienteController.mostrarCliente);

    //Actualizar cliente
    router.put('/clientes/:idCliente', auth, clienteController.actualizarCliente);

    //Eliminar cliente
    router.delete('/clientes/:idCliente', auth, clienteController.eliminarCliente);
    //=========================================================================

    /**PRODUCTOS */
    //Agregar productos via POST
    router.post('/productos', auth, productosController.subirImagen,
    productosController.nuevoProducto);

    //Mostrar todos los productos
    router.get('/productos', auth, productosController.mostrarProductos);

    //Mostrar productos por su id
    router.get('/productos/:idProducto', auth, productosController.mostrarProducto); 

    //Actualizar productos
    router.put('/productos/:idProducto', auth, productosController.subirImagen,
    productosController.actualizarProducto);

    //Eliminar un producto por id
    router.delete('/productos/:idProducto', auth, productosController.eliminarProducto);
    
    //Busqueda de productos
    router.post('/productos/busqueda/:query', productosController.buscarProducto);
    //=========================================================================

    /**PEDIDOS */
    //Agreagr un nuevo pedido
    router.post('/pedidos/:idPedido', auth, pedidosController.nuevoPedido);

    //Mostrar los pedidos
    router.get('/pedidos', auth, pedidosController.mostrarPedidos);

    //Mostrar un pedido por su id
    router.get('/pedidos/:idPedido', auth, pedidosController.mostrarPedido);

    //Actualizar pedidos
    router.put('/pedidos/:idPedido', auth, pedidosController.actualizarPedido);

    //Eliminar pedido por id
    router.delete('/pedidos/:idPedido', auth, pedidosController.eliminarPedido);
    //=========================================================================

    /**USUARIOS */
    //Crear una nueva cuenta
    router.post('/crear-cuenta', auth, usuariosController.registrarUsuario);

    //Iniciar sesio
    router.post('/iniciar-sesion', usuariosController.autenticarUsuario);


    return router;
}