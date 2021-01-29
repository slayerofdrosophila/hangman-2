import { Socket } from "socket.io";
import { isLetter } from "./client/src/player";

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
            console.log('newplayerword'+word+connectingsocket.id+socketid); 

            if (socketid !== connectingsocket.id){
                connectingsocket.emit('newplayerword',players[socketid][1],socketid); // this sends the new connector the woirdb the lloop si currently on (not its own word)
                console.log("newplayerword-SPECIAL-"+word+connectingsocket.id+socketid);
            }
        };

        console.log(word); 
    });

    connectingsocket.on('guess', function (letter: string, targetid: string) {
        
        letter = letter.toUpperCase();
        if (! isLetter(letter)){ 
            return; // rejects all non-letter guesses
        }

        let word = players[targetid][1] // word is a list

        let hitcounter = 0;
        for (let position in word) {
            if (letter == word[position]){ // if correct
                hitcounter += 1;
            }
        }

        if (hitcounter == 0) { // no matching letters
            connectingsocket.broadcast.emit("wrongguess", connectingsocket.id, targetid, letter); // sends 2 everyone but the sender
            connectingsocket.emit("wrongguess", connectingsocket.id, targetid, letter); // sends 2 the sender
            console.log("wrong guess" + connectingsocket.id)
        }
        else{
            for (let socketid in players) {
                let connection = players[socketid][0];
                connection.emit('rightguess', connectingsocket.id, targetid, letter); 
                console.log("rite guess" + targetid)
        }
    }
    });

    // socket.on('cardPlayed', function (gameObject, isPlayerA) {
    //     io.emit('cardPlayed', gameObject, isPlayerA);
    //     console.log('played card!');
    // });


 // blah blah


    connectingsocket.on('disconnect', function () {
        console.log('A user disconnected: ' + connectingsocket.id);
        delete players[connectingsocket.id];
    });
});
