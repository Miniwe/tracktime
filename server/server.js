var express = require('express');
var app = express();
var config = require('../config/config.json');
app.set('env', config.env);

var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');

// var records = require('./records');
var db = require('./libs/db');


app.use(require('./libs/cors'));
app.use(require('express-uncapitalize')());
app.use(require('method-override')());
app.use(require('cookie-parser')());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

var accessLogStream = fs.createWriteStream(__dirname + '/../'+config.logPath+'/server_access.log',{flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}))

// // development only
if ('development' == app.get('env')) {
    app.use(require('errorhandler')());
    require('express-debug')(app, {/* settings */});
}

// app.use(express.session({ secret: 'cool beans' }));
// app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/index')(express));
app.use('/records', require('./routes/records')(express, db.get()));

app.use(require('./libs/errors-handlers'));

var server = app.listen(config.server.port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
});
