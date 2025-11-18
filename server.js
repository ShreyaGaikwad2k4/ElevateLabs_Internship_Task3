// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // parse JSON body

// In-memory store
let books = [];
let nextId = 1; // incremental id

// GET /books - return all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id - return single book
app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// POST /books - add new book
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'title and author are required' });
  }
  const newBook = { id: nextId++, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id - update a book by id
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, author } = req.body;
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  // update only provided fields
  if (title !== undefined) books[index].title = title;
  if (author !== undefined) books[index].author = author;

  res.json(books[index]);
});

// DELETE /books/:id - remove a book
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const removed = books.splice(index, 1)[0];
  res.json({ message: 'Book deleted', book: removed });
});

// Simple root message
app.get('/', (req, res) => {
  res.send('Books API running. Use /books to interact.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
