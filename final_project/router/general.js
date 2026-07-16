const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found for this ISBN." });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.keys(books)
    .filter(key => books[key].author === author)
    .map(key => books[key]);

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this author." });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.keys(books)
    .filter(key => books[key].title === title)
    .map(key => books[key]);

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title." });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found for this ISBN." });
  }
});

// ---- Part E: Axios versions (Tasks 10-13) ----

// Task 10: Get all books – async/await
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Task 11: Search by ISBN – Promises
function getBookByISBN(isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => console.error(error.message));
}

// Task 12: Search by Author – async/await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Task 13: Search by Title – Promises
function getBooksByTitle(title) {
  return axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => console.error(error.message));
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
