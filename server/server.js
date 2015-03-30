var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var fs = require('fs');

var config = require('../config/config.json');
var cors = require('./libs/cors.js');
var records = require('./records');



app.use(cors);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(methodOverride());

var accessLogStream = fs.createWriteStream(__dirname + '/../'+config.logPath+'/server_access.log',{flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}))

// app.use(express.session({ secret: 'cool beans' }));
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
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({body: req.body}, null, 2));
})


var server = app.listen(config.server.port, function () {

  var host = server.address().address
  var port = server.address().port

  // console.log('Example app listening at http://%s:%s', host, port)
});
