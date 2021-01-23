import { Socket } from "socket.io";

'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/client/index.html'


const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);



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



    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players.delete (socket.id);
    });
});


