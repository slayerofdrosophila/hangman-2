After overwriting the README for the fourth time, I have given up on rewriting it again.       
I barely know how the code works myself but if you ask I will try my best to walk it through on a call or something.      
(and its not a "haha its magic" but because my dad wrote a good amount of it and i was basically transcribing it xdxd)


v. 0.1 (1/28/21)
game events are shared with all clients                 
damage is assigned to the right player (isnt perfect)                                   
your own word has a star next to it to show you it is yours

---

todo:      
make the acctual game: (turns)                                      
making the thing playable on smaller screen when there are more than 4 people                   
rooms?     
usernames      
word filters / categories + character limits (customizable)         
accounts (sql??)            
actual art              


how to run locally:
* run npm install
* run parcel in one terminal (.\node_modules\.bin\parcel .\client\src\index.html)
* run the server in another window (.\node_modules\.bin\nodemon --watch server.ts --exec npm start)
* parcel will refresh the client when u make a change to its code (repackaging it in dist,)       
* nodemon will refresh the server when u make a change to its code                     

how to get server working (on azure)            
* use app service
* set WEBSITES_PORT to 3000 (or set the code to use 8080 instead)               
* set WEBSITES_CONTAINER_START_TIME_LIMIT to 1800 (this is the max value)