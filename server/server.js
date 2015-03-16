var express = require('express');
var server = require("http").Server(express);
var io = require("socket.io")(server);
var app = module.exports = express();



var handleClient = function (socket) {
socket.on( 'connect', function() {
    console.log('Connection Established! Ready to send/receive data!');
    socket.send('my message here');
    socket.send(1234567);
    socket.send([1,2,3,4,5]);
    socket.send({ apples : 'bananas' });
} );

socket.on( 'message', function(message) {
    console.log(message);
} );

socket.on( 'disconnect', function() {
    console.log('my connection dropped');
} );

// Extra event in Socket.IO provided by PubNub
socket.on( 'reconnect', function() {
    console.log('my connection has been restored!');
} );


};

io.on("connection", handleClient);


app.set('port', process.env.PORT || 3000);
// app.configure(function () {
// });

//define routes
app.get('/', function (req, res) {
  res.send('Hello World!');
})

//define routes
app.get('/users', function (req, res) {
  res.send('tweet!');
})


server.listen(app.get('port'), function(){
    // console.log('Listening on port ' + app.get('port'));
});
