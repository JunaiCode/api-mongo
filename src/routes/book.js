const express = require('express');
// Router me permite definir las rutas de la aplicación
const router = express.Router();
// El modelo Book me permite interactuar con la colección de libros
const Book = require('../models/book');


//MIDDLEWARE PARA OBTENER UN LIBRO
const getBook = async (req, res, next) => {
    let book;
    const {id} = req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        book = await Book.findById(req.params.id);
        if(!book) {
            return res.status(404).json({ message: 'Cannot find book' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.book = book;
    next();
}

// Definimos la ruta para obtener todos los libros
router.get('/', async (req, res) => {
    try {
        // Consultamos todos los libros
        const books = await Book.find();
        console.log('GET ALL', books);
        // Si no hay libros, respondemos con un código 204
        if(books.length === 0) return res.status(204).json([])
        // Respondemos con la lista de libros en formato JSON
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Definimos la ruta para crear un libro (recurso)
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req.body;
    if(!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'Missing required information' });
    }
    // Creamos un nuevo libro con la información enviada
    const book = new Book({
        title,
        author,
        genre,
        publication_date,
    });
    
    try {
        // Guardamos el libro en la base de datos
        const newBook = await book.save();
        console.log('POST', newBook);
        // Respondemos con el libro creado en formato JSON
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
);

// Definimos la ruta para obtener un libro por su ID y le pasamos el middleware                         
router.get('/:id', getBook, (req, res) => {
    res.json(res.book);
});

// Definimos la ruta para actualizar un libro por su ID
router.put('/:id', getBook, async (req, res) => {
    const { title, author, genre, publication_date } = req.body;
    if(!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'Missing required information' });
    }
    try {
        const book = res.book;
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.publication_date = publication_date || book.publication_date;
        const updatedBook = await book.save();
        console.log('PUT', updatedBook);
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Definimos la ruta para modificar solo un campo de un libro por su ID
router.patch('/:id', getBook, async (req, res) => {
    const { title, author, genre, publication_date } = req.body;
    if(!title && !author && !genre && !publication_date) return res.status(400).json({ message: 'Missing required information' });
    try {
        const book = res.book;
        if(title) book.title = title;
        if(author) book.author = author;
        if(genre) book.genre = genre;
        if(publication_date) book.publication_date = publication_date;
        const updatedBook = await book.save();
        console.log('PATCH', updatedBook);
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Definimos la ruta para eliminar un libro por su ID
router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        console.log('DELETE', res.book);
        res.json({ message: 'Deleted book' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Exportamos el router
module.exports = router;