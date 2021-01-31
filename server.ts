import { Socket } from "socket.io";
import { isLetter, Player } from "./client/src/player";

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



let players: Client[] = []; // string = socket i | Socket = actual connection, string = word , int = p[layer number]
let playercount: integer;
let currentturn: integer = 1;

class Client {
    connection: Socket
    word: string[] = []
    playernumber: integer = -1
    constructor (connection: Socket){
        this.connection = connection
    }
}

io.on('connection', function (connectingsocket:Socket) {
    console.log('A user connected: ' + connectingsocket.id);

    players[connectingsocket.id] = new Client(connectingsocket); // when ppl connect it gives them a spot in the map, a socket, and empty string and -1 index

    connectingsocket.on ("playerword",(word) => { // receives word (list) from client 

        for (let i in word){
            word[i] = word[i].toUpperCase();
        }

        playercount = 0;
        for (let index in players){
            playercount += 1;
            console.log("players: "+ playercount);
        }

        players[connectingsocket.id].word = word;
        players[connectingsocket.id].playercount = playercount;

        for (let socketid in players) {
            let connection = players[socketid].connection;
            let playernumber = players[connectingsocket.id].playernumber;
            connection.emit('newplayerword', word, connectingsocket.id,playernumber); // emites the new word (and socket id) to the current client connection imn the loop
            console.log('newplayerword'+word+connectingsocket.id+socketid, " ", playernumber); 

            if (socketid !== connectingsocket.id){
                connectingsocket.emit('newplayerword',players[socketid].word,socketid,playernumber); // this sends the new connector the woirdb the lloop si currently on (not its own word)
                console.log("newplayerword-SPECIAL-"+word+connectingsocket.id+socketid, " ", playernumber);
            }
        };

        if (playercount === 1){
            connectingsocket.emit('myturn')
        }

        console.log(word); 
    });

    connectingsocket.on('guess', function (letter: string, targetid: string) {

        let sourcenumber = players[connectingsocket.id].playernumber;
        if (sourcenumber !== currentturn){
            console.log("DENIED it is player " + currentturn + " 's turn!!")
            return;
        }
        
        letter = letter.toUpperCase();
        if (! isLetter(letter)){ 
            return; // rejects all non-letter guesses
        }

        if (players[targetid] == null){
            console.log("guessed at null")
            return
        }


        let word = players[targetid].word // word is a list

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
                let connection = players[socketid].connection;
                connection.emit('right', connectingsocket.id, targetid, letter); 
                console.log("rite guess" + targetid);
        }
    }

    currentturn = iterateturn(currentturn)
    turnemit()
    });



    connectingsocket.on('disconnect', function () {
        console.log('A user disconnected: ' + connectingsocket.id);

        let deadnumber = players[connectingsocket.id].playernumber
        delete players[connectingsocket.id];
        playercount -= 1

        // decrement all numbers > deadnumber
        for (let index in players){
            if (deadnumber < players[index].playernumber){
                players[index].playernumber -= 1
            }
        }
        
        // case 1 currentturn > deadnumber
        if (currentturn > deadnumber){
            currentturn -= 1
        }
        else if (currentturn === deadnumber){ // case 2 doesnt need to be handled
            if (deadnumber > playercount){
                currentturn = 1
            }
            turnemit()
        }
        
        for (let socketid in players) {
            let connection = players[socketid].connection;
            connection.emit('death', connectingsocket.id); 
            console.log("death");
    }
    });

});

function iterateturn(x: integer){
    x += 1;
    if (x > playercount){
        x = 1
    }
    console.log(currentturn + " iterated to")
    return x;
}

function turnemit(){
    for (var index in players){
        if (players[index].playernumber === currentturn){ // players is a global variable hahaha
            players[index].connection.emit('myturn') 
            break
        }
    }

}