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



let players:{ [socketid: string]: [Socket,string[],integer] } = {}; // string = socket id, Socket = actual connection, string = word 
let playercount: integer;
let currentturn: integer = 1;

io.on('connection', function (connectingsocket:Socket) {
    console.log('A user connected: ' + connectingsocket.id);

    players[connectingsocket.id] = [connectingsocket,[],-1]; // when ppl connect it gives them a spot in the map, a socket, and empty string and -1 index

    connectingsocket.on ("playerword",(word) => { // receives word (list) from client 

        for (let i in word){
            word[i] = word[i].toUpperCase();
        }

        playercount = 0;
        for (let index in players){
            playercount += 1;
            console.log("players: "+ playercount);
        }

        players[connectingsocket.id] = [connectingsocket,word, playercount]; // thois isnt overwriting the sockerid, socketid is the index and it overwewrieteds the word value at that index 

        for (let socketid in players) {
            let connection = players[socketid][0];
            let playernumber = players[connectingsocket.id][2];
            connection.emit('newplayerword', word, connectingsocket.id,playernumber); // emites the new word (and socket id) to the current client connection imn the loop
            console.log('newplayerword'+word+connectingsocket.id+socketid, " ", playernumber); 

            if (socketid !== connectingsocket.id){
                connectingsocket.emit('newplayerword',players[socketid][1],socketid,playernumber); // this sends the new connector the woirdb the lloop si currently on (not its own word)
                console.log("newplayerword-SPECIAL-"+word+connectingsocket.id+socketid, " ", playernumber);
            }
        };

        if (playercount === 1){
            connectingsocket.emit('myturn')
        }

        console.log(word); 
    });

    connectingsocket.on('guess', function (letter: string, targetid: string) {

        let sourcenumber = players[connectingsocket.id][2];
        if (sourcenumber !== currentturn){
            console.log("DENIED it is player " + currentturn + " 's turn!!")
            return;
        }
        
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
            connectingsocket.broadcast.emit("wrong", connectingsocket.id, targetid, letter); // sends 2 everyone but the sender
            connectingsocket.emit("wrong", connectingsocket.id, targetid, letter); // sends 2 the sender
            console.log("wrong guess" + connectingsocket.id);
        }
        else{
            for (let socketid in players) {
                let connection = players[socketid][0];
                connection.emit('right', connectingsocket.id, targetid, letter); 
                console.log("rite guess" + targetid);
        }
    }

    currentturn = iterateturn(currentturn)
    console.log(currentturn + " iterated to")
    for (var index in players){
        if (players[index][2] === currentturn){ // players is a global variable hahaha
            players[index][0].emit('myturn') 
            break
        }
    }

    });



    connectingsocket.on('disconnect', function () {
        console.log('A user disconnected: ' + connectingsocket.id);
        delete players[connectingsocket.id];
        playercount -= 1

        let deadnumber = players[this.connectingsocket][2]

        // decrement all numbers > deadnumber
        for (let index in players){
            if (deadnumber < players[index][2]){
                players[index][2] -= 1
            }
        }

        if (deadnumber > playercount){
            iterateturn(currentturn)
        }
        
        for (let socketid in players) {
            let connection = players[socketid][0];
            connection.emit('death', players[this.connectingsocket][2]); 
            console.log("death");
    }
    });

});

function iterateturn(x: integer){
    x += 1;
    console.log("current turn: " + x);
    if (x > playercount){
        x = 1
    }
    return x;
}
