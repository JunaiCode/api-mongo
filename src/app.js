const express = require('express');
const mongoose = require('mongoose');
// Sirve para poder leer el cuerpo de las peticiones HTTP
const bodyParser = require('body-parser');
const {config} = require('dotenv');
config();
const bookRouter = require('./routes/book');

// Definimos el puerto que usará el servidor
const port = process.env.PORT || 3000;

const app = express();
//Usamos el middleware para poder leer el cuerpo de las peticiones
app.use(bodyParser.json());
// Conectamos a la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName:process.env.MONGO_DB_NAME});
const db = mongoose.connection;
// Si hay un error, lo mostramos en consola
db.on('error', (error) => console.error(error));
// Si la conexión es exitosa, mostramos un mensaje en consola
db.once('open', () => console.log('Connected to Database'));

// Definimos la ruta para los libros asignandole el router que creamos
app.use('/books', bookRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});