/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        console.log('Response:', res.body);
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let testBookId;
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const title = 'Test Book Title';
        chai.request(server)
        .post('/api/books')
        .send({title})
        .end((err,res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', "Book should contain _id");
          assert.equal(res.body.title, title, 'Book title should match');
          testBookId = res.body._id; // Save the book ID for future tests
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end((err,res) => {
          assert.equal(res.status, 400);
          assert.equal(res.text, 'missing required field title');
          done();
        })
      });
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/' + 'testid')
        .end((err,res) => {
          chai.expect(res).to.have.status(404);
          chai.expect(res.text).to.equal('no book exists');
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + testBookId)
        .end((err,res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.be.an('object');
          chai.expect(res.body).to.have.property('_id');
        assert.equal(res.body._id, testBookId);
        done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const testComment = 'This is a test comment';
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({ comment: testComment })
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.body).to.be.an('object');
            chai.expect(res.body).to.have.property('_id');
            chai.expect(res.body).to.have.property('title');
            chai.expect(res.body).to.have.property('comments');
            assert.equal(res.body.comments[res.body.comments.length - 1], testComment);
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({})
          .end((err, res) => {
            chai.expect(res).to.have.status(400);
            chai.expect(res.text).to.equal('missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const nonExistentId = 'nonexistentid';
        chai.request(server)
          .post('/api/books/' + nonExistentId)
          .send({ comment: 'Test comment for non-existent book' })
          .end((err, res) => {
            chai.expect(res).to.have.status(400);
            chai.expect(res.text).to.equal('no book exists');
            done();
          });
      });

      
    });

    suite('DELETE /api/books => delete book', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/' + testBookId)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.text).to.equal('delete successful');
          done();
        })
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        const nonExistentId = 'nonexistentid';
        chai.request(server)
          .delete('/api/books/' + nonExistentId)
          .end((err, res) => {
            chai.expect(res).to.have.status(404);
            chai.expect(res.text).to.equal('no book exists');
            done();
      });

    });

      test('Test DELETE /api/books to delete all books in the database', function(done) {
        chai.request(server)
          .delete('/api/books')
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.text).to.equal('complete delete successful');
            done();
          });
      });

  });

});

});
