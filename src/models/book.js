// Mongoose me sirve para definir el esquema de la base de datos
const mongoose = require('mongoose');

// Definimos el esquema de la base de datos
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    genre:{
        type: String,
        required: true,
    },
    publication_date:{
        type: Date,
        required: true,
    },
    }
);

// Exportamos el modelo
module.exports = mongoose.model('Book', bookSchema);
