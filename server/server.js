var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var config = require('./config.json');
var cors = require('./libs/cors.js');
var records = require('./records');


app.use(cors);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(express.cookieParser());
// app.use(express.session({ secret: 'cool beans' }));
// app.use(express.methodOverride());
// app.use(allowCrossDomain);
// app.use(app.router);
// app.use(express.static(__dirname + '/public'));



// @todo handling 404 errors
// app.use(function(err, req, res, next) {
//   if(err.status !== 404) {
//     next();
//   }
//   res.send(err.message || '** no unicorns here **');
// });

// app.get('*', function(req, res, next) {
//   var err = {}; //new Error();
//   err.status = 404;
//   err.message = 'Have 404';
//   next(err);
// });


// app.configure(function () {
//     app.use(express.methodOverride());
//     app.use(express.bodyParser());
//     app.use(function(req, res, next) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "X-Requested-With");
//       next();
//     });
//     app.use(app.router);
// });

// app.configure('development', function () {
//     app.use(express.static(__dirname + '/public'));
//     app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

// app.configure('production', function () {
//     app.use(express.static(__dirname + '/public'));
//     app.use(express.errorHandler());
// });

app.get('/', function (req, res) {
  res.send('Hello World! 2')
})

app.get('/records', function (req, res) {
  res.send(records);
})

app.post('/records', function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.write('any will posted');
  res.end(JSON.stringify(req.body, null, 2));
})


var server = app.listen(config.port, function () {

  var host = server.address().address
  var port = server.address().port

  // console.log('Example app listening at http://%s:%s', host, port)
});
