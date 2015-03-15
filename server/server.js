var express = require('express');
var server = require("http").Server(express);
var io = require("socket.io")(server);
var app = module.exports = express();



var handleClient = function (socket) {
    // we've got a client connection
    var tweet = {user: "nodesource", text: "Hello, world!"};

    // to make things interesting, have it send every second
    var interval = setInterval(function () {
        socket.emit("tweet", tweet);
    }, 1000);

    socket.on("disconnect", function () {
        clearInterval(interval);
    });

};



app.set('port', process.env.PORT || 3000);
// app.configure(function () {
// });

io.on("connection", handleClient);

//define routes
app.get('/', function (req, res) {
  res.send('Hello World!');
})

//define routes
app.get('/users', function (req, res) {
  res.send('Hello from users!');
})


server.listen(app.get('port'), function(){
    // console.log('Listening on port ' + app.get('port'));
});


