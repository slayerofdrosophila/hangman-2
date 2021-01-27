import { Socket } from "socket.io";

const express = require('express');
const server = express();
server.use('/', express.static('dist'))

const http = require('http').createServer(server);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
var port = normalizePort(process.env.PORT || '3000');
http.listen(port, function () {
    console.log('Server started!');
});

const io = require('socket.io')(http);

let players = new Map<string,Socket>();

io.on('connection', function (socket:Socket) {
    console.log('A user connected: ' + socket.id);

    players.set(socket.id,socket); // set adds / replaces to a map

    socket.on ("playerword",(word) => { // receives word from client

        for (let i in word){
            word[i] = word[i].toUpperCase();
        }

        players.forEach((sock, player) => {
            sock.emit('newplayerword', word, socket.id); // emites the things
            console.log('newplayerword'+word+socket.id); 
        });
        console.log(word); 
    });

    // socket.on('dealCards', function () {
    //     io.emit('dealCards');
    //     console.log('dealing cards!');
    // });

    // socket.on('cardPlayed', function (gameObject, isPlayerA) {
    //     io.emit('cardPlayed', gameObject, isPlayerA);
    //     console.log('played card!');
    // });


 // bla


    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players.delete (socket.id);
    });
});
