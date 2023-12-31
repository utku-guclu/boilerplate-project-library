/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const bookController = require('../controllers/bookController');

module.exports = function (app) {

  app.route('/api/books')
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    .get(bookController.getAllBooks)
     //response will contain new book object including atleast _id and title
    .post(bookController.addBook)
    
      //if successful response will be 'complete delete successful'
    .delete(bookController.deleteAllBooks);



  app.route('/api/books/:id')
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    .get(bookController.getBookById)
    
      //json res format same as .get
    .post(bookController.addCommentToBook)
    
      //if successful response will be 'delete successful'
    .delete(bookController.deleteBookById);
  
};
