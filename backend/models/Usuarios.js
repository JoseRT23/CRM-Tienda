const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({

    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: 'Agrega tu nombre'
    },
    password: {
        type: String,
        required: true
    }

},{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Usuarios', usuariosSchema);