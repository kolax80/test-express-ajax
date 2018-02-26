
var path = require('path');
var express = require('express');
var engine = require('ejs-locals'); // for layouts
// var exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
// создаем парсер для данных форм application/x-www-form-urlencoded
var dataPost = bodyParser.urlencoded({extended: false});  //для получения обычных данных POST
// для работы с json форматами
var jsonParser = bodyParser.json();
// app.engine('.hbs', exphbs({
//     defaultLayout: 'main',
//     extname: '.hbs',
//     layoutsDir: path.join(__dirname, 'views/layouts')
// }))
// app.set('view engine', '.hbs')
// app.set('views', path.join(__dirname, 'views'))

var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mymongo";
var objectId = require("mongodb").ObjectID; // если мы ищем по id

// // configure app
// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// // use middleware

// // запуск sudo service mongod start
// //define routes
var users;
mongoClient.connect(url, function(err, client){
    var  db = client.db('mymongo');
        if(err){
            return console.log(err);
        }
        // db.collection('users').insert({name:'gggg',age: 34}, function(err, result){
        //       if(err){
        //             return console.log(err);
        //         }
        //
        //     });
          // поиск по id
        db.collection('users').findOne({_id: objectId('5a65e76c8c5d9c63169c0d00')}, function (err, docs) {
          console.log(docs);
        });
        // поиск по свойству name
        db.collection('users').findOne({name: 'kolax'}, function (err, docs) {
          console.log(docs);
        });

      //  переборка коллекции
        db.collection('users').find().toArray(function (err, docs) {
           users = docs;
          console.log(users);
        });

        app.get('/users', function (req, res) {
            res.render('users',{
              users: users,
            });
        });

  });

var artists = [
  {id:1, name: 'Name 1'},
  {id:2, name:'Metalica'},
  {id:3, name:'Avici'}
];
app.get('/', function (req, res) {
    res.render('home',{
    	text:'kolax',
      items:artists,
    });
});


app.post("/", jsonParser, function (req, res) {   // post ajax
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    if(req.body.userName == ''){
      var mess = 'Заполните поле';
      res.send(mess);
      // res.render('home',{
      // 	mess:'Заполните поле',
      // });
    } else {
    artists.push({
      id: req.body.userName,
      name: req.body.userAge
    });
    var test = 1;
    res.json(artists);
  }
//  res.send(`${req.body.userName} - ${req.body.userAge}`);
});


app.get('/artist/:id', function (req, res) {
  console.log(req.params);
  var artist = artists.find(function(artist){
    return artist.id === Number(req.params.id);
  });
    res.send(artist);
});


// для получения стандартных get параметров с помощью типа ?id=111&test=4775
app.get('/items', function( req, res) {
var id = req.query.id;
var test = req.query.test;
res.send('id='+id+'; test='+test);

});

app.get('/about', function (req, res) {
  var date = new Date();
    res.render('home',{
    	text:'content',
      name:'Alex',
      time:date,
    });
});

// запуск в консоле    mongo --host 127.0.0.1:27017
// var mongoClient = require('mongodb').MongoClient;
//
// var url = "mongodb://127.0.0.1:27017/mymongo";
// mongoClient.connect(url, function(err, db){
//
//     var db = db.db('mymongo');
//     var user = {name: "Tom", age: 23};
//     db.collection('users').insert(user, function(err, result){
//
//         if(err){
//             return console.log(err);
//         }
//         console.log(result.ops);
//
//     });
// });




 app.listen(3000);
