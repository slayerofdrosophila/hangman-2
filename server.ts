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



let players:{ [socketid: string]: [Socket,string[]] } = {}; // string = socket id, Socket = actual connection, string = word 

io.on('connection', function (connectingsocket:Socket) {
    console.log('A user connected: ' + connectingsocket.id);

    players[connectingsocket.id] = [connectingsocket,[]]; // set adds / replaces to a map

    connectingsocket.on ("playerword",(word) => { // receives word (list) from client 

        for (let i in word){
            word[i] = word[i].toUpperCase();
        }

        players[connectingsocket.id] = [connectingsocket,word]; // thois isnt overwriting the sockerid, socketid is the index and it overwewrieteds the valyue at that index 


        for (let socketid in players) {
            let connection = players[socketid][0];
            connection.emit('newplayerword', word, connectingsocket.id); // emites the new word (and socket id) to the current client connection imn the loop
            console.log('newplayerword'+word+connectingsocket.id); 

            if (socketid !== connectingsocket.id){
                connectingsocket.emit('newplayerword',players[socketid][1],socketid); // this sends the new connector the woirdb the lloop si currently on
            }
        };

        


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


    connectingsocket.on('disconnect', function () {
        console.log('A user disconnected: ' + connectingsocket.id);
        delete players[connectingsocket.id];
    });
});
