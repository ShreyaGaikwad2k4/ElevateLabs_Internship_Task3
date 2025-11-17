const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

let books = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', quantity: 15 },
    { id: '2', title: '1984', author: 'George Orwell', isbn: '9780451524935', quantity: 8 },
];
let nextId = 3; 

// Middleware setup
app.use(cors()); 
app.use(bodyParser.json());


const findBookIndex = (id) => books.findIndex(book => book.id === id);

app.get('/api/books', (req, res) => {
    // Send the current list of books
    console.log(`Fetched ${books.length} books.`);
    res.status(200).json(books);
});

// POST /api/books - Add a new book (CREATE)
app.post('/api/books', (req, res) => {
    const { title, author, isbn, quantity } = req.body;
    
    // Basic validation
    if (!title || !author || !isbn || !quantity) {
        return res.status(400).json({ error: 'Missing required fields (title, author, isbn, quantity).' });
    }

    const newBook = {
        id: String(nextId++),
        title,
        author,
        isbn,
        quantity: parseInt(quantity, 10),
    };

    books.push(newBook);
    console.log('Book added with ID:', newBook.id);
    res.status(201).json(newBook);
});

// PUT /api/books/:id - Update a book (UPDATE)
app.put('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const updates = req.body;
    const index = findBookIndex(bookId);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    books[index] = { 
        ...books[index], 
        ...updates,
        quantity: updates.quantity !== undefined ? parseInt(updates.quantity, 10) : books[index].quantity
    };

    console.log('Book updated:', bookId);
    res.status(200).json(books[index]);
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const index = findBookIndex(bookId);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    // Remove the book from the array
    books.splice(index, 1);
    console.log('Book deleted:', bookId);
    
    // 204 No Content for successful deletion
    res.status(204).send(); 
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/book_inventory.html');
});


// Start the server
app.listen(PORT, () => {
    console.log(`\nServer is running on http://localhost:${PORT}`);
    console.log(`Open the Book Inventory App in your browser at: http://localhost:${PORT}`);
    console.log(`\nNOTE: Data is NOT persistent; it resets when the server stops.`);

});
