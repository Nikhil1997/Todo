
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb+srv://Target123:{password}@todo.xuccv.mongodb.net/todo?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).catch(error => handleError(error));

//Create a Schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
  item : String
});

var Todo = mongoose.model('Todo' , todoSchema);

var urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = function(app) {

  app.get('/todo', function(req, res) {
      //get data from Mongo DB and pass it to the View
      Todo.find({} , function(err, data){
          if(err) throw err;
          res.render('todo', {todos : data});
      });

  });

  app.post('/todo', urlencodedParser, function(req, res) {
        // get data from the view and add it to mongodb
        var newTodo = Todo(req.body).save(function(err, data){
          if(err) throw err;
          res.json(data);
        });

  });

  app.delete('/todo/:item', function(req, res) {
      // delete the requested item from Mongo DB
      Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
          if(err) throw err;
          res.json(data);
      });

  });

}
