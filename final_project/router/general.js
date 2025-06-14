const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fetchBooks = () => new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(books)
    },6000)
})

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    let dbBooks = await fetchBooks;
    res.send(JSON.stringify(dbBooks,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    let dbBooks = await fetchBooks;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    let dbBooks = await fetchBooks;
    const author = req.params.author;
    const book = Object.keys(books).forEach(isbn => {
        const book = books[isbn];
        if (book.author.toLowerCase() === author.toLowerCase()) {
            return res.send(book);
        }
    })
    res.status(404).json({ message: "Author not found" });
 });

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    let dbBooks = await fetchBooks;
    const book = Object.keys(books).forEach(isbn => {
        const book = books[isbn];
        if (book.title.toLowerCase() === title.toLowerCase()) {
            return res.send(book);
        }
    })
    res.status(404).json({ message: "Title not found" });
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]
    if (!book) {
        res.status(404).json({ message: "Book not found" });
    } else {
        res.send(book.reviews);
    }
 });

module.exports.general = public_users;
