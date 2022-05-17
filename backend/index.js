const express = require('express');
const routes = require('./routes/index');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({path: 'variables.env'});

//Cors permitir conexiones
const cors = require('cors');

//Conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});

//Crear el servidor
const app = express();

//Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Habilitar cors
app.use(cors());

//Definir dominio desde el cual se recibiran peticiones
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        //Revisar si la peticion viene de un servidor que esta en whiteList
        const exist = whiteList.some(dominio => dominio === origin);
        if(exist) {
            callback(null, true);
        }else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

//Rutas de la app
app.use('/', routes());

//Carpeta publica
app.use(express.static('uploads'));

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

//Puerto
app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
});