//let word = "continent";
//for (i=0;i<hfWords.length;i++){console.log(hfWords[i].Word)}
randomNumber = Math.floor(Math.random() * hfWords.length);
let word = hfWords[randomNumber].Word;
// console.log(hfWords[randomNumber].Word)
// console.log(hfWords[randomNumber].WordLength)
// console.log(hfWords[randomNumber].IndexLetter)
// console.log(hfWords[randomNumber].Set)
// console.log(hfWords[randomNumber].Letters)

let listOfWords = []
// for (i = 0; i < hfWords.length; i++) { if (hfWords[i].WordLength === 14) { listOfWords.push(hfWords[i]) } }
// console.log(listOfWords)



let gamePlay = document.querySelector('.gamePlay');
const definitionApiIntro = document.querySelector('.definitionApiIntro');
const definitionApiWord = document.querySelector('.definitionApiWord');
const definitionApiDefinitions = document.querySelector('.definitionApiDefinitions');
let userInputJSON = "";
let wordLists = [hfWords, bigWords]; //List of variable pointing to the different word lists


function analyzeWords(userWordLength, userString) {
    console.log("inside analyze words function: userWordLength:", userWordLength, "userString",userString)
    for (i = 0; i < hfWords.length; i++) {


        if (hfWords[i].IndexLetter === userString) {
            console.log(hfWords[i], "this works", hfWords[i].Word, hfWords[i].WordLength, hfWords[i].IndexLetter,hfWords[i].Letters)

            // console.log(JSON.parse(hfWords[10].IndexLetter));
            // console.log({0: 'g', 1: 'o'})
            //  === JSON.parse('{ 0: 'g', 1: 'o' }')) {
            //     console.log("it works")
            // };

        }
    }

}



document.getElementById("newGame").onclick = function () {    //sets the wordlength variable upon new game click and sets the html for gameplay
    var userInputWordLength = document.getElementById("numberOfLetters").value; //gets value of user input text box
    var html = '';
    for (var i = 0; i < userInputWordLength; i++) {
        html +=
            '<div>' +
            `<form class="letterBox" >` +
            `<input type="text" id="${i}"  maxlength="1">` +
            '</div>'
    }
    html += '<button type="button" id="submitLettersButton">Submit</button>' + '</form>';
    gamePlay.innerHTML = html;


    //Takes user input and stores into userInput JSON format
    document.getElementById("submitLettersButton").onclick = function () {
        userInputJSON += '{';
        for (i = 0; i < userInputWordLength; i++) {
            userInputJSON +=  i + ": '" + document.getElementById(i).value + "'"
            if (i != userInputWordLength - 1) { userInputJSON += ", " };
        }
        userInputJSON += '}';
        //console.log(userInput)
        analyzeWords(userInputWordLength, userInputJSON)
    }
}




function fetchData(url) { // Will use this as a general fetch -ex: dictionary def, wikipedia image possibly
    return fetch(url)
        .then(checkStatus) //looks for status errors
        .then(res => res.json()) // parses
        .catch(error => console.log('There was a problem attempting to retrieve this information:', error))
}



fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`) //fetch for dictionary definition
    .then(data => generateDefinitionDisplay(data))



function generateDefinitionDisplay(data) {  //displays the dictionary definition
    //console.log(data);
    if (data[0] || data[0].shortdef[0]) {    //checks to make sure a valid definition came through and not suggestions     
        definitionApiWord.innerHTML = "I'm not saying this is your word, but it could be: " + word; //data[0].hwi.hw;  // + " " + data[0].shortdef[0]; //word
        let listOfDefinitions = "";
        for (let i = 0; i < data[0].shortdef.length; i++) { listOfDefinitions += i + 1 + ".) " + data[0].shortdef[i] + " " }
        definitionApiDefinitions.innerHTML = "Definition: " + listOfDefinitions;
    } else {
        console.log("A minor error: A single definition didn't come through")
        definitionApiWord.innerHTML = "The dictionary is not pleased"

    }


}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);

    } else {
        return Promise.reject(new Error(reponse.statusText));
    }

}





// console.log(window.words)