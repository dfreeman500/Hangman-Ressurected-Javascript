// const { parallel } = require("async");

var gamePlay = document.querySelector('.gamePlay');
const definitionApiIntro = document.querySelector('.definitionApiIntro');
const definitionApiWord = document.querySelector('.definitionApiWord');
const definitionApiDefinitions = document.querySelector('.definitionApiDefinitions');
const statsBox = document.querySelector('.StatsBox');
const message = document.querySelector('.Messages');
const UpperWaterfall = document.querySelector('.UpperWaterfall');
const LowerWaterfall = document.querySelector('.LowerWaterfall');


// let wordLists = [hfWords, bigWords]; //List of variable pointing to the different word lists
var candidateWords = []
let eliminatedWords = []

var lettersGuessed = []
var incorrectLetters = []
var masterIncorrectLetters = []

var letterFrequency = []


var userInputWordLength;
let listOfWords = []
var bigWordsSubset = []



//REPLACE WITH FETCH() as XMLHttpReuqest has deprecated portions, also put in function
let bigWordsRequest = new XMLHttpRequest();
bigWordsRequest.open("GET", "bigWords.json", false);
bigWordsRequest.send(null)
var bigWords = JSON.parse(bigWordsRequest.responseText)
console.log(bigWords);

let hfWordsRequest = new XMLHttpRequest();
hfWordsRequest.open("GET", "hfWords.json", false);
hfWordsRequest.send(null)
var hfWords = JSON.parse(hfWordsRequest.responseText)
console.log(hfWords)

function hangmanStartup() {
    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    var html = "this is it";
    gamePlay.innerHTML = html;  //injects the html into the gameplay section

    // while(html != "h"){

    //     setTimeout(() => {  html = alphabet[Math.floor(Math.random() * alphabet.length)]}, 250);
    //     gamePlay.innerHTML = html;  //injects the html into the gameplay section

    // }
}
hangmanStartup()

//finds all of the letters in the possible words and counts them, returns an array of letters presented in frequency order w/o counts
function countLetters(string) {
    let letterMap = {}
    let letterArray = []
    let valuesArray = []
    //let maxLetterValue = 0

    //creates a map with Frequency:Letter
    for (let char of string) {
        if (letterMap.hasOwnProperty(char)) {
            letterMap[char]++;
        } else {
            letterMap[char] = 1;
        }
    }

    letterArray = Object.keys(letterMap)
    valuesArray = Object.values(letterMap)
    //maxLetterValue = Math.max(...valuesArray)
    var valueSet = new Set(valuesArray)
    var newSortedLettersFromSet = [...valueSet]
    newSortedLettersFromSet.sort(function (a, b) { return b - a }); //Sorts the set from largest to smallest

    let newSortedLetters = []

    ///iterate through the set of frequency numbers by value
    for (let item of newSortedLettersFromSet) {
        //iterate through array of letters by index
        for (let i = 0; i < valuesArray.length; i++) {
            //if letters w/ index[i] equals the value of the frequency number and it's not already in the newSortedLetters array, add it
            if (valuesArray[i] === item && newSortedLetters.includes(letterArray[i]) == false) {
                newSortedLetters.push(letterArray[i])
            }
        }
    }
    //console.log("letterMap: ", letterMap)
    console.log("newsortedLetters: ", newSortedLetters)
    return newSortedLetters
}

//finds a random word in the candidateWords that contains the current guessed letter
function chooseDefinedWord(theGuess) {
    try {
        let focusCandidateWords = []
        console.log("this is the Guess:", theGuess)
        console.log(candidateWords);
        for (let i of candidateWords) {
            if (i.Word.includes(theGuess) == true) {
                focusCandidateWords.push(i)
            }
        }
        console.log("This is the focus candidate array: ", focusCandidateWords)

        randomNumber = Math.floor(Math.random() * focusCandidateWords.length);
        word = focusCandidateWords[randomNumber].Word;
        fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`) //fetch for dictionary definition
            .then(data => generateDefinitionDisplay(data, word, wordFullyGuessed = false, requestFromWhere = "notUserInitiated"))
    }
    catch (err) {
        console.log(err.message);
    }
}

//Runs through letters in order by frequency and finds the next letter that hasn't been guessed and is not represented in the userInput
function makeAGuess(arrayOfLettersByFrequency, userInputString) {
    for (i = 0; i < arrayOfLettersByFrequency.length; i++) {
        if (!userInputString.includes(arrayOfLettersByFrequency[i]) && !lettersGuessed.includes(arrayOfLettersByFrequency[i])) {
            lettersGuessed.push(arrayOfLettersByFrequency[i])
            console.log("This is the letters guessed array:", lettersGuessed)
            console.log("This is the incorrectLetters array:", incorrectLetters, " length: ", incorrectLetters.length)
            //console.log("This is the masterIncorrectLetters array:", masterIncorrectLetters, " length: ", masterIncorrectLetters.length)
            console.log("This is my guess:", arrayOfLettersByFrequency[i])
            return theGuess = arrayOfLettersByFrequency[i]
        }
    }
}

//Determines which word is a candidate and which can be ruled out
function analyzeWords(userWordLength, userInputString, incorrectLetters, masterIncorrectLetters, wordList) {
    allLettersFromValidWords = []
    letterFrequency = []
    var wordFullyGuessed = false;
    // var candidateWordsVariable = " ";

    //candidateWords = []
    //eliminatedWords = []
    //Consider using filter method here????
    for (i = 0; i < wordList.length; i++) {
        var isCandidateWord = true;
        if (wordList[i].Word.length == userWordLength) {
            //var a = wordList[i].Word
            for (let j = 0; j < userWordLength; j++) { //iterates through each possible word to find candidate
                if (userInputString[j] != " " && userInputString[j] != wordList[i].Word[j]) {
                    isCandidateWord = false;
                    break;
                }
                //Elminates words that have letter within the userInputString but in the wrong location --> "b","u","l"," "  should eliminate "bull" and "bulb" but not "bulk"
                if (userInputString[j] === " " && userInputString.includes(wordList[i].Word[j])) {
                    isCandidateWord = false;
                    break;
                }
                // if the possible candidate has letters in the incorrectLetters then isCandidateWord= false
                for (k = 0; k < incorrectLetters.length; k++) {
                    if (wordList[i].Word.includes(incorrectLetters[k])) {
                        isCandidateWord = false;
                    }
                }
            }
            //If the word is a candidate, add it to the candidate list and add the SET of letters to the letter list
            if (isCandidateWord === true) {
                candidateWords.push(wordList[i])
                // exhibitWords(wordList[i], wordGroup = "candidateWords", candidateWordsVariable)
                var candidateWordSet = Array.from(new Set(wordList[i].Word));
                for (j = 0; j < candidateWordSet.length; j++) {
                    var letterCheck = /^[a-zA-Z]+$/; //only alpha - avoids non alpha characters getting into alletters...
                    if (letterCheck.test(candidateWordSet[j])) {  //Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
                        allLettersFromValidWords += candidateWordSet[j]
                    }
                }

            } else {
                eliminatedWords.push(wordList[i])
            }

            if (wordList[i].Word === userInputString) {
                console.log("The candidate word:", wordList[i].Word, "matches the userString", userInputString);
                wordFullyGuessed = true;
            }
        }
    }


    //console.log("this is candidate words: ", candidateWords, "this is eliminated words: ", eliminatedWords,"this is alllettersfromvalidwords", allLettersFromValidWords, "The wordlist is: ", wordList);
    // incorrectLetters;
    // masterIncorrectLetters;
    return { candidateWords, eliminatedWords, allLettersFromValidWords, wordFullyGuessed, incorrectLetters, masterIncorrectLetters }
}

//Controls the message in the message box,
function messages(info, userInputString, candidateWords, wordList) {
    console.log("The messages function ran", info, userInputString, candidateWords)
    if (info == true) {
        message.innerHTML = `<div ><h1><p> I have guessed your word. It is "${userInputString}".</p></h1></div>`
    } else if (candidateWords.length == 0) {
        message.innerHTML = `<div ><h1><p> Something went Wrong!! Are you sure you told me the correct letters. Look over the letters I've already guessed to make sure. Are you having me guess a real word?</p></h1></div>`
    }
    else if (info == false) {
        message.innerHTML = '<div ><h1><p> Please only give me lower case letters</p></h1></div>'
    } else if (info == "invalidWordLength") {
        message.innerHTML = `<div ><h1><p> It doesn't look like you have a real word in mind. Please give me a number above 0 and one that corresponds to the length of a real word</p></h1></div>`
    }

    else {
        let messageToUser = '<div >'
        if (wordList == bigWordsSubset) {
            messageToUser += `<h1><p> You are asking me to guess a rare word. This is going to take some time to think. </h1>`
        }
        messageToUser += `<h1><p> Does your word have the letter ${info} ?</h1>`
        if (candidateWords != null) {
            console.log("It's not null")
        } else { console.log("it is null") }

        if (candidateWords != null && candidateWords.length == 1) {
            messageToUser += `<h1>Because I'm thinking your word is ... ${candidateWords[0].Word}.</h1>`
            console.log("this is what I'm trying to print", candidateWords[0])
        }
        messageToUser += '</p></div>'
        message.innerHTML = messageToUser;
    }
}

//Takes multiple user inputs, checks for valid inputs, and generates the userInputString
function compileUserInput(userInputWordLength, firstRun) {
    var userInputString = "";
    if (firstRun == true) {
        for (i = 0; i < userInputWordLength; i++) {
            userInputString += " ";
        }
        console.log("1userINputstring is now:", userInputString, userInputString.length)
    } else {
        for (i = 0; i < userInputWordLength; i++) {
            let letterInput = document.getElementById(i).value
            if (letterInput != "") {
                userInputString += letterInput
                var letterCheck = /^[a-z]+$/; //checks each letterInput to make sure it is lower case and alpha and lower case
                if (letterCheck.test(letterInput)) {  //Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
                    var value = true
                } else {
                    var value = false;
                    return messages(false, userInputString = "invalid", candidateWords)
                }
            } else {
                userInputString += " "
            }
        }
    }
    console.log("user input in various forms", i, "userInputString:", userInputString, "userINputString length:", userInputString.length)
    candidateWords = []
    eliminatedWords = []


    console.log("This should be exiting")
    return { userInputString }
}

//The difference betwen masterIncorrectLetters and incorrectLetters shows if user changed the input from one response to the next
function determineListOfIncorrectLetters(userInputString, incorrectLetters, masterIncorrectLetters, lettersGuessed) {
    for (i = 0; i < lettersGuessed.length; i++) {
        if (!userInputString.includes(lettersGuessed[i]) && !incorrectLetters.includes(lettersGuessed[i])) {
            incorrectLetters.push(lettersGuessed[i])
        }
        if (!userInputString.includes(lettersGuessed[i]) && !masterIncorrectLetters.includes(lettersGuessed[i])) {
            masterIncorrectLetters.push(lettersGuessed[i])
        }
    }
    lettersGuessed;
    return { incorrectLetters, masterIncorrectLetters }
}

function orderOfOperations(userInputString, incorrectLetters, masterIncorrectLetters, lettersGuessed, firstRun, wordList) {
    candidateWords;
    bigWordsSubset;
    wordList;
    var { userInputString } = compileUserInput(userInputWordLength, firstRun);
    var { incorrectLetters, masterIncorrectLetters, lettersGuessed } = determineListOfIncorrectLetters(userInputString, incorrectLetters = [], masterIncorrectLetters, lettersGuessed);
    //console.log("this is the word list:", wordList)
    var { candidateWords, eliminatedWords, allLettersFromValidWords, wordFullyGuessed, incorrectLetters, masterIncorrectLetters } = analyzeWords(Number(userInputWordLength), userInputString, incorrectLetters, masterIncorrectLetters, wordList)
    if (candidateWords.length == 0 && wordList == hfWords) {
        wordList = bigWordsSubset;
        messages(theGuess, userInputString, candidateWords, wordList)
        var { candidateWords, eliminatedWords, allLettersFromValidWords, wordFullyGuessed, incorrectLetters, masterIncorrectLetters } = analyzeWords(Number(userInputWordLength), userInputString, incorrectLetters, masterIncorrectLetters, wordList)
        wordList = candidateWords
    }
    chooseDefinedWord(makeAGuess(countLetters(allLettersFromValidWords), userInputString))
    messages(theGuess, userInputString, candidateWords, wordList)
    if (firstRun == false) {
        changeAddLetter(theGuess, userInputWordLength)
    }
    bigWordsSubset;
    candidateWords;
    wordList;

    if (wordFullyGuessed == true) {
        messages(wordFullyGuessed, userInputString, candidateWords)
        try {

            fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${userInputString}?key=${apiKey}`) //fetch for dictionary definition
                .then(data => generateDefinitionDisplay(data, userInputString, wordFullyGuessed = true, requestFromWhere = "wordFullyGuessed"))
        }
        catch (err) {
            console.log(err.message);
        }
    };
    console.log("after analyze words", "userInputString:", userInputString, "userINputString length:", userInputString.length)
    waterfalls(candidateWords, eliminatedWords)
    statsInfo(userInputString, candidateWords, incorrectLetters, masterIncorrectLetters, wordList)

}

//Takes the user input (word length) and determines if this is going to be a valid word
function wordLengthValidator(userInputWordLength) {
    validWordLength = false;
    //var wordLengthSet = new Set();
    var testCondition = /^\d+$/; //only numerics
    if (!testCondition.test(userInputWordLength)) {
        return validWordLength
    }
    let lengthVerification = ['1', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '2', '20', '21', '22', '23', '24', '25', '27', '28', '29', '3', '31', '4', '45', '5', '6', '7', '8', '9']
    lengthVerification.includes(userInputWordLength) ? validWordLength = true : validWordLength = false;
    //let a = lengthVerification.includes(userInputWordLength)
    return validWordLength;
}

function addLetter(i, theGuess) {
    document.getElementById(`${i}`).value = `${theGuess}`

}

function changeAddLetter(theGuess, userInputWordLength) {
    for (let i = 0; i < userInputWordLength; i++) {
        let letterbox = document.getElementById(`${i}`);

        if (letterbox.value == "") {
            let temp = document.getElementById(`buttonAddLetter${i}`);
            temp.appendChild(document.createElement("B"))
            temp.innerHTML = `<button type="button" id="b${i}" onclick= addLetter(${i},"${theGuess}")>${theGuess}</button>`
        } else {
            let temp = document.getElementById(`buttonAddLetter${i}`);
            temp.appendChild(document.createElement("B"))
            temp.innerHTML = `<button type="button" id="b${i}" onclick= addLetter(${i},"${letterbox.value}")>${letterbox.value}</button>`
        }
    }
}



//builds the form that user will use to input responses
function buildGamePlayBox(userInputWordLength, theGuess) {
    var html = "";
    html += '<div class="containsLetters">'
    for (var i = 0; i < userInputWordLength; i++) {
        html += `<div class="conLandB" id="conLandB${i}">` +
            '<div class="letterBox" >' +
            `<form >` +
            `<input type="text" id="${i}"  maxlength="1">` +
            '</div>' +
            `<div class="buttonAddLetter" id="buttonAddLetter${i}">` +
            `<button type="button" id="b${i}" onclick= addLetter(${i},"${theGuess}")>${theGuess}</button>` +

            '</div>' +
            `</div>`

        // document.getElementById(`b${i}`).onclick = function () {
        //     console.log("it works") 
        //     fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/race?key=${apiKey}`) //fetch for dictionary definition
        //     .then(data => generateDefinitionDisplay(data, "race"))
        // }
    }
    html += '</div>'
    html += '<button type="button" id="submitLettersButton">Add letters if appropriate and then click to submit</button>' + '</form>';
    gamePlay.innerHTML = html;  //injects the html into the gameplay section
    // for (var i = 0; i < userInputWordLength; i++) {
    //     document.getElementById(`${i}`).value = "j";
    // }
    //lettersGuessed = []
    masterIncorrectLetters = []
    incorrectLetters = []
    //var userInputSet = new Set();
    var userInputString = "";
    return userInputString


}

function getWordsXLength(number) {
    for (let i = 0; i < bigWords.length; i++) {
        if (bigWords[i].Word.length == number) {
            bigWordsSubset.push(bigWords[i])
        }
    }
    return bigWordsSubset;
}

//Click events - new game and submit letters
document.getElementById("newGame").onclick = function () {    //sets the wordlength variable upon new game click and sets the html for gameplay
    userInputWordLength = document.getElementById("numberOfLetters").value; //gets value of user input text box
    var userInputString = "";
    incorrectLetters = []
    masterIncorrectLetters = []
    lettersGuessed = []
    console.log("New Game was clicked")
    userInputWordLength < 15 ? wordList = hfWords : wordList = bigWords;

    bigWordsSubset = []
    bigWordsSubset = getWordsXLength(userInputWordLength)
    bigWordsSubset;

    if (wordLengthValidator(userInputWordLength) == false) {
        messages("invalidWordLength", userInputString = 0, candidateWords = 0)
    } else {
        orderOfOperations(userInputString, incorrectLetters, masterIncorrectLetters, lettersGuessed, firstRun = true, wordList)
        userInputString = buildGamePlayBox(userInputWordLength, theGuess)

    }

    document.getElementById("submitLettersButton").onclick = function () {
        console.log("Submit was clicked")
        incorrectLetters = []
        masterIncorrectLetters;
        orderOfOperations(userInputString, incorrectLetters, masterIncorrectLetters, lettersGuessed, firstRun = false, wordList)
        console.log(wordList, candidateWords)
    }
}


function fetchData(url) { // Will use this as a general fetch -ex: dictionary def, wikipedia image possibly
    return fetch(url)
        .then(checkStatus) //looks for status errors
        .then(res => res.json()) // parses
        .catch(error => console.log('There was a problem attempting to retrieve this information:', error))
}



//prints definition from API to the page
function generateDefinitionDisplay(data, word, wordFullyGuessed, requestFromWhere) {  //displays the dictionary definition
    console.log(data);
    if (data[0] || data[0].shortdef[0]) {    //checks to make sure a valid definition came through and not suggestions     
        if (wordFullyGuessed == true) {
            definitionApiWord.innerHTML = `Your word is ${word}:`
        } else if (requestFromWhere === "userInitiated") {
            definitionApiWord.innerHTML = `You wish to know the the definition of the word ${word}:`
        } else {
            definitionApiWord.innerHTML = "I'm not saying this is your word, but it could be: " + word; //data[0].hwi.hw;  // + " " + data[0].shortdef[0]; //word
        }
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

//This function generates stats and prints them to the page 
function statsInfo(userInputString, candidateWords, incorrectLetters, masterIncorrectLetters, wordList) {
    masterIncorrectLetters;
    incorrectLetters;
    //determines number of leters given by the user
    let numberOfLettersGivenByUser = 0;
    for (i = 0; i < userInputString.length; i++) {
        var letterCheck = /^[a-zA-Z]+$/; //only alpha
        if (letterCheck.test(userInputString[i])) {  //Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
            numberOfLettersGivenByUser += 1;
        }
    }

    //determines estimated errors in candidateWords
    let listOfErrorNumbers = []
    let totalErrors;
    for (let i = 0; i < candidateWords.length; i++) {
        listOfErrorNumbers.push(candidateWords[i].Errors)
        totalErrors += candidateWords[i].Errors
    }

    //sums the errors to get the average later
    var sum = listOfErrorNumbers.reduce(function (a, b) {
        return a + b;
    }, 0);

    console.log("this is the list of errors:", listOfErrorNumbers)
    console.log("math max:", Math.max(...listOfErrorNumbers))
    console.log("total errors:", sum)


    let stats = '<div >'
    stats += `<p> Your word is <b> ${userInputWordLength} </b> letters long.</p>` +

        `<p> You have provided me <b> ${numberOfLettersGivenByUser} </b> of the <b> ${userInputWordLength} </b> letters: <b> ${userInputString} </b></p>`

    if (masterIncorrectLetters.length != incorrectLetters.length) {
        stats += `<p style="color:#FF0000"> You changed your mind on on a letter. That's ok... but the stats might be slightly off.</p>`
    }

    wordList == hfWords ? dictionary = "small" : dictionary = "big"
    stats += `<p> I have guessed <b> ${lettersGuessed.length} </b> time(s) and they are <b> ${lettersGuessed} </b>.</p>` +
        `<p> I have guessed incorrectly <b> ${incorrectLetters.length} </b> time(s) given that you've said the following letters are incorrect:<b> ${incorrectLetters}</b></p>` +
        `<p> At the present time, I feel VERY confident that I will guess your word in <b> ${(Math.max(...listOfErrorNumbers) > incorrectLetters.length ? Math.max(...listOfErrorNumbers) : incorrectLetters.length)}</b> or fewer errors.</p>` +
        `<p> At the present time I feel that I will <b>likely</b> guess your word using <b> ${((Math.ceil(sum / candidateWords.length)) > incorrectLetters.length ? (Math.ceil(sum / candidateWords.length)) : incorrectLetters.length)} </b> or fewer errors. </p>` +
        `<p> I am using the ${dictionary} dictionary</p>`
    if (dictionary == "big") {
        stats += `<p style="color:#FF0000">... it may take me a little longer to think.</p>`
    }

    stats += '</div>'
    statsBox.innerHTML = stats;

    let errorColors = ["#5be162", "#69ce5a", "#76bb52", "#84a94a", "#929641", "#9f8339", "#ad7131", "#bb5e29", "#c84b21", "#d63818", "#e42510", "#f11308", "#ff0000"]
    let background = document.querySelector('.gamePlay')
    background.style.backgroundColor = errorColors[incorrectLetters.length]
    let b = background.style.backgroundColor
    b
}
// 


//append child //create element  -- get rid of double loops
// https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild

//This function prints the candidate words and eliminated words with a link to check their definition
function waterfalls(candidateWords, eliminatedWords) {


    let candidateWordsVariable = candidateWords.length + " Candidate Words: ";
    if (candidateWords != null) {
        for (let i = 0; i < candidateWords.length; i++) {

            candidateWordsVariable += `<a id=${candidateWords[i].Word} href=#>${candidateWords[i].Word}</a>`
            candidateWordsVariable += " "

            if (i > 300) {
                break
            }
        }
        UpperWaterfall.innerHTML = candidateWordsVariable;
        for (let i = 0; i < candidateWords.length; i++) {

            try {
                //create single function and call - DRY

                document.getElementById(candidateWords[i].Word).onclick = function () {
                    fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${candidateWords[i].Word}?key=${apiKey}`) //fetch for dictionary definition
                        .then(data => generateDefinitionDisplay(data, candidateWords[i].Word, wordFullyGuessed = false, requestFromWhere = "userInitiated"))
                }
            }
            catch (err) {
                console.log(err.message);
            }
            if (i > 300) {
                break
            }
        }

    }

    let eliminatedWordsVariable = eliminatedWords.length + " Eliminated Words: ";
    if (eliminatedWords != null) {
        for (let i = 0; i < eliminatedWords.length; i++) {
            eliminatedWordsVariable += `<a id=${eliminatedWords[i].Word} href=#>${eliminatedWords[i].Word}</a>`
            eliminatedWordsVariable += " "
        }
        LowerWaterfall.innerHTML = eliminatedWordsVariable;
        for (let i = 0; i < eliminatedWords.length; i++) {

            try {

                document.getElementById(eliminatedWords[i].Word).onclick = function () {
                    fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${eliminatedWords[i].Word}?key=${apiKey}`) //fetch for dictionary definition
                        .then(data => generateDefinitionDisplay(data, eliminatedWords[i].Word, wordFullyGuessed = false, requestFromWhere = "userInitiated"))
                }
            }
            catch (err) {
                console.log(err.message);

            }
        }
    }
}


//alternative to waterfalls - attempt for faster less loops
// function exhibitWords(word, wordGroup, candidateWordsVariable) {
    // var node
    // node.innerHTML = `<a id=${word.Word} href=#>${word.Word}</a>`
    // // let a = document.createElement(`<a id=${word.Word} href=#>${word.Word}</a>`)

    // UpperWaterfall.appendChild(node)
    // try {
    //     document.getElementById(eliminatedWords[i].Word).onclick = function () {
    //         fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word.Word}?key=${apiKey}`) //fetch for dictionary definition
    //             .then(data => generateDefinitionDisplay(data, word.Word, wordFullyGuessed = false, requestFromWhere = "userInitiated"))
    //     }
    // }
    // catch (err) {
    //     console.log(err.message);
    // }
 

// }





    // if (wordGroup=="candidateWords"){
    //     var temp = document.getElementById("UpperWaterfall")
    // }else{
    //     var temp = document.getElementById("LowerWaterfall");
    // }
    // var para = document.createElement("A");
    // para.innerHTML = word.Word
    // var b = document.getElementById("UpperWaterfall")
    // b.appendChild(para)

    // var h = document.createElement("div")
    // var textnode = document.createTextNode(`${word}`)
    // h.appendChild(textnode)
    //     document.getElementById(para).onclick = function () {
    //         fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word.Word}?key=${apiKey}`) //fetch for dictionary definition
    //             .then(data => generateDefinitionDisplay(data, word.Word, wordFullyGuessed = false, requestFromWhere = "userInitiated"))
    // }

    //     document.getElementById(temp).appendChild(node);


