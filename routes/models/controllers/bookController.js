// bookController.js

const mongoose = require('mongoose');
const Book = require('../models/Book');

// Controller for /api/books route
exports.getAllBooks = function (req, res) {
  // Implement logic to get all books
  Book.find({})
    .exec() // Use the exec() method to execute the query
    .then((books) => {
      console.log('Books:', books);

      const response = books.map((book) => ({
        _id: book._id,
        title: book.title,
        commentcount: (book.comments && book.comments.length) || 0,
      }));

      console.log('Response:', response);

      res.json(response);
    })
    .catch((err) => {
      console.error('Error fetching books:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};


// Implement logic to add a new book
exports.addBook = async (req, res) => {
  // check if the 'title' is included in the request body
  try {
    // check if the 'title' is included in the request body
    if (!req.body.title) {
      return res.status(400).send('missing required field title');
    }

    const newBook = new Book({
      title: req.body.title,
    });

    const savedBook = await newBook.save();
    res.json({
      title: savedBook.title,
      _id: savedBook._id,
    });
  } catch (err) {
    console.error(err);
    return res.json({ error: 'Error saving the book to the database' });
  }
}

exports.deleteAllBooks = function (req, res) {
  // Implement logic to delete all books
  Book.deleteMany({})
  .exec()
  .then(() => {
    res.send('complete delete successful');
  })
  .catch((err) => {
    console.error('Error deleting books:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
};

// Controller for /api/books/:id route
exports.getBookById = function (req, res) {
  // Implement logic to get a book by ID
  const bookId = req.params.id;

  // Validate if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(404).send('no book exists');
  }
  
  Book.findById(bookId)
    .exec() // Use the exec() method to execute the query
    .then((book) => {
      if (!book) {
        return res.status(404).send('no book exists');
      }
      const response = {
        _id: book._id,
        title: book.title,
        comments: book.comments || [],
      }

      res.json(response);
    })
    .catch((err) => {
      console.error('Error fetching book:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

exports.addCommentToBook = function (req, res) {
  // Implement logic to add a comment to a book
    let bookId = req.params.id;
    let comment = req.body.comment;

  // Validate if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).send('no book exists');
  }

  // Check if the comment is included in the request
  if (!comment) {
    return res.status(400).send('missing required field comment');
  }
  // Use findByIdAndUpdate to add a comment to the book
  Book.findByIdAndUpdate(
    bookId,
    { $push: { comments: comment } },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(404).send('no book exists');
      }

      // Return the updated book object
      res.json({
        _id: updatedBook._id,
        title: updatedBook.title,
        comments: updatedBook.comments || [],
      });
    })
    .catch((err) => {
      console.error('Error adding comment to book:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

exports.deleteBookById = function (req, res) {
  const bookId = req.params.id;
  // Implement logic to delete a book by ID
  // Validate if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(404).send('no book exists');
  }
  // Use Mongoose to find and remove the book by ID
  Book.findByIdAndDelete(bookId)
    .exec()
    .then((deletedBook) => {
      if (!deletedBook) {
        return res.status(404).send('no book exists');
      }
      res.status(200).send('delete successful');
    })
    .catch((err) => {
      console.error('Error deleting book:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

