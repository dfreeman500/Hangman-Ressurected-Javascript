//let word = "continent";
//for (i=0;i<hfWords.length;i++){console.log(hfWords[i].Word)}

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
let userInputJSON;
let wordLists = [hfWords, bigWords]; //List of variable pointing to the different word lists
let candidateWords = []
let eliminatedWords = []

var lettersGuessed=[]
var allLettersFromValidWords=[]
var letterFrequency=[]


function analyzeWords(userWordLength, userInputIndexed, userInputString, userInputLetterArray) {
    console.log("inside analyze words function: userWordLength:", userWordLength, "userString", userInputIndexed)


    for (i = 0; i < hfWords.length; i++) {
        var isCandidateWord = true;
        if (hfWords[i].WordLength == userWordLength) {
            for (j = 0; j < userWordLength; j++) {
                // if (userString[j] === " " || userString[j] == hfWords[i].IndexLetter[j]){
                //     isCandidateWord = true
                // }else{isCandidateWord=false}
                // console.log(hfWords[i].IndexLetter[j], userString[j], isCandidateWord)
                if (userInputIndexed[j] === " " || userInputIndexed[j] == hfWords[i].IndexLetter[j]) {
                    //isCandidateWord=true;
                    console.log(isCandidateWord)
                } else {
                    isCandidateWord = false;
                    break;
                }
            }
            if (isCandidateWord === true) {
                candidateWords.push(hfWords[i])
            } else {
                eliminatedWords.push(hfWords[i])
            }
        }
    }
    console.log("this is candidate words: ", candidateWords);
    console.log("this is eliminated words: ", eliminatedWords);
    console.log("this is a candidate word:", candidateWords[0].Word)

    //finds a random word in the candidateWords array and picks a random one
    randomNumber = Math.floor(Math.random() * candidateWords.length);
    word = candidateWords[randomNumber].Word;  
    fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`) //fetch for dictionary definition
        .then(data => generateDefinitionDisplay(data))
}


document.getElementById("newGame").onclick = function () {    //sets the wordlength variable upon new game click and sets the html for gameplay
    var userInputWordLength = document.getElementById("numberOfLetters").value; //gets value of user input text box
    var html = "";
    for (var i = 0; i < userInputWordLength; i++) {
        html +=
            '<div class="letterBox" >' +
            `<form >` +
            `<input type="text" id="${i}"  maxlength="1">` +
            '</div>'
    }
    html += '<button type="button" id="submitLettersButton">Submit</button>' + '</form>';
    gamePlay.innerHTML = html;  //injects the html into the gameplay section


    //Takes user input and stores into userInput JSON format
    document.getElementById("submitLettersButton").onclick = function () {
        var userInputString = "";
        var userInputLetterArray = []
        var userInputSet = new Set();
        for (i = 0; i < userInputWordLength; i++) {
            let letterInput = document.getElementById(i).value
            if (letterInput != "") {
                userInputString += letterInput
            } else {
                userInputString += " "
            }
        }
        //console.log("this is the input string", userInputString);

        userInputJSON = new Map();
        for (i = 0; i < userInputWordLength; i++) {
            userInputJSON[i] = userInputString[i]
            userInputLetterArray.push(userInputString[i])
            userInputSet.add(userInputString[i]);
        }
        userInputSet.add(userInputLetterArray);
        console.log("user input in various forms",i, userInputJSON, userInputString, userInputLetterArray, userInputSet)
        candidateWords = []
        eliminatedWords = []
        analyzeWords(userInputWordLength, userInputJSON, userInputString, userInputLetterArray, userInputSet)
    }

}




function fetchData(url) { // Will use this as a general fetch -ex: dictionary def, wikipedia image possibly
    return fetch(url)
        .then(checkStatus) //looks for status errors
        .then(res => res.json()) // parses
        .catch(error => console.log('There was a problem attempting to retrieve this information:', error))
}



// fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`) //fetch for dictionary definition
//     .then(data => generateDefinitionDisplay(data))




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

