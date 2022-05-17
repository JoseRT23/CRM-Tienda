const Productos = require('../models/Productos');

const multer = require('multer');
const shorid = require('shortid');
const  fs = require('fs');

//Configuración de multer
const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/');
        },
        filename: (req, file, cb) => {
            const extencion = file.mimetype.split('/')[1];
            cb(null, `${shorid.generate()}.${extencion}`);
        },
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            //el cb se ejecuta como true o false
            cb(null, true);
        }else {
            cb(new Error('Formato no valido'));
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

//Subir imagen
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            res.json({message : 'error'})
        }
        return next();
    });

}

//Agregar nuevos productos
exports.nuevoProducto = async (req, res, next) => {
    const producto = new Productos(req.body);

    try {
        if (req.file.filename) {
            producto.imagen = req.file.filename
        }
        await producto.save();
        res.json({message : 'Se agrego un nuevo producto'});
        
    } catch (error) {
        console.log(error);
        next();
    }
}

//Mostrar todos los productos
exports.mostrarProductos = async (req, res, next) => {
    try {
        const productos = await Productos.find({});
        res.json(productos);
    } catch (error) {
        console.log(error);
        next();
    }
}

//Mostrar un producto en especifico
exports.mostrarProducto = async (req, res, next) => {
    const producto = await Productos.findById(req.params.idProducto);

    if (!producto) {
        res.json({message : 'Este producto no exite'});
        return next();        
    }

    //Mostrar producto
    res.json(producto);
}

//Actuliza un producto con la id
exports.actualizarProducto = async (req, res, next) => {

    try {
        let productoAnterior = await Productos.findById(req.params.idProducto);

        //Construir nuevo producto
        let nuevoProducto = req.body;

        //Verificar si hay una imagen nueva
        if (req.file) {
            nuevoProducto.imagen = req.file.filename;
        }else{
            nuevoProducto.imagen = productoAnterior.imagen
        }

        let producto = await Productos.findOneAndUpdate({_id : req.params.idProducto},
            nuevoProducto, {
                new: true,
        });
        
        res.json(producto);

    } catch (error) {
        console.log(error);
        next();
    }
}

//Elimina un producto via id
exports.eliminarProducto = async (req, res, next) => {
    try {
        let imagen = await Productos.findById(req.params.idProducto);
        const imagenEliminar = __dirname + `/../uploads/${imagen.imagen}`;
        fs.unlink(imagenEliminar, (error) => {
            if (error) {
                console.log(error);
            }
            return;
        });
        await Productos.findOneAndDelete({_id : req.params.idProducto});
        res.json({message : 'Producto eliminado'})
    } catch (error) {
        console.log(error);
        next();        
    }
}

//Buscar un producto
exports.buscarProducto = async (req, res, next) => {
    try {
        //Obtener query
        const { query } = req.params;
        const product = await Productos.find({ nombre: new RegExp(query, 'i')});
        res.json(product);
    } catch (error) {
        console.log(error);
        next();
    }
}