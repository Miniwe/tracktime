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


app.listen(app.get('port'));

// console.log('Listening on port ' + app.get('port'));

/*
-------------
var app = require("express");


app.listen(8080);

io.on("connection", function (socket) {
});
*/

