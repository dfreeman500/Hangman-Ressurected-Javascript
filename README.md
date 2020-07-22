# Hangman-Resurrected-Javascript
Simple hangman game, where the computer guesses your word
It visualizes data by showing words that are candidates for the word that is being guessed and also words that have been eliminated. You can look up simple definitions by clicking on those words. This application uses Merriam-Webster's API (https://dictionaryapi.com/) to display definitions.


Dependencies/Instructions:
* Download github repository to preferred directory
* Install Node.js
* Install http-server (https://www.npmjs.com/package/http-server)
    * In Node.js Command prompt type: npm install --global http-server
    * Once installed, type: http-server [directory], ex: http-server "C:\HangmanGame"
    * Once the server is started it will state the address: ex: http://127.0.0.1:8080
    * Copy the address into the address bar in your browser
* Create a "api.js" in the same directory as index.html and paste given API key into this file
* Enjoy the hangman game


Notes on JSON files:
    I believe the list of words in hfWords.json originally was from a 5000 most frequently used word list. It may have been this website (https://www.wordfrequency.info/), but I cannot find the link to download again. In any case I removed about 700 words from the list. The words in bigWords.json were originally from https://github.com/dwyl/english-words, however I at some point merged this list with another and have also removed words that clearly weren't English as this larger list has several errors especially in the smaller words.

