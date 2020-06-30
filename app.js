let gamePlay = document.querySelector('.gamePlay');
const definitionApiIntro = document.querySelector('.definitionApiIntro');
const definitionApiWord = document.querySelector('.definitionApiWord');
const definitionApiDefinitions = document.querySelector('.definitionApiDefinitions');
const statsBox = document.querySelector('.StatsBox');
const message = document.querySelector('.Messages');


let userInputJSON;
let wordLists = [hfWords, bigWords]; //List of variable pointing to the different word lists
let candidateWords = []
let eliminatedWords = []

var lettersGuessed = []
var incorrectLetters = []
var letterFrequency = []

var userInputWordLength;
let listOfWords = []



//finds all of the letters in the possible words and counts them, returns an array of letters presented in frequency order w/o counts
function countLetters(string) {
    let letterMap = {}
    let letterArray = []
    let valuesArray = []
    //let maxLetterValue = 0

    //creates a map with Frequency:Letter
    for (let char of string) {
        if (letterMap.hasOwnProperty(char)) {
            letterMap[char]++
        } else {
            letterMap[char] = 1
        }
    }

    letterArray = Object.keys(letterMap)
    valuesArray = Object.values(letterMap)
    //maxLetterValue = Math.max(...valuesArray)
    var valueSet = new Set(valuesArray)
    var newSortedLettersFromSet = [...valueSet]
    newSortedLettersFromSet.sort(function (a, b) { return b - a }); //Sorts the set from largest to smallest
    //console.log("this is new sorted letters from set", newSortedLettersFromSet)

    let newSortedLetters = []

    ///iterate through the set of frequency numbers by value
    for (let item of newSortedLettersFromSet) {
        //iterate through array of letters by index
        for (let i = 0; i < valuesArray.length; i++) {
            //if letters w/ index[i] equals the value of the frequcy number and it's not already in the newSortedLetters array, add it
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
            .then(data => generateDefinitionDisplay(data))
    }
    catch (err) {
        console.log(err.message);
    }
}

//Runs through letters in order by frequency - and finds the next letter that hasn't been guessed and is not represented in the userInput
function makeAGuess(arrayOfLettersByFrequency, userInputString) {
    for (i = 0; i < arrayOfLettersByFrequency.length; i++) {
        if (!userInputString.includes(arrayOfLettersByFrequency[i]) && !lettersGuessed.includes(arrayOfLettersByFrequency[i])) {
            lettersGuessed.push(arrayOfLettersByFrequency[i])
            console.log("This is the letters guessed array:", lettersGuessed)
            console.log("This is the incorrectLetters array:", incorrectLetters, " length: ", incorrectLetters.length)
            console.log("This is the masterIncorrectLetters array:", masterIncorrectLetters, " length: ", masterIncorrectLetters.length)

            console.log("This is my guess:", arrayOfLettersByFrequency[i])
            var theGuess = arrayOfLettersByFrequency[i]
            chooseDefinedWord(theGuess)
            break;
        }
    }
    messages(theGuess)
}



//Determines which word is a candidate and which can be ruled out
function analyzeWords(userWordLength, userInputIndexed, userInputString, userInputLetterArray, userInputSet) {
    console.log("inside analyze words function: userWordLength:", userWordLength, "userInputString", userInputString, "userInputLetterArray", userInputIndexed, "userInputSet", userInputSet)
    allLettersFromValidWords = []
    letterFrequency = []

    //Consider using filter method here????
    for (i = 0; i < hfWords.length; i++) {
        var isCandidateWord = true;
        if (hfWords[i].WordLength == userWordLength) {
            for (j = 0; j < userWordLength; j++) { //iterates through each possible word to find candidate
                if (userInputIndexed[j] === " " || userInputIndexed[j] == hfWords[i].IndexLetter[j]) {
                    //console.log(isCandidateWord)
                } else {
                    isCandidateWord = false;
                    break;
                }

                //Elminates words that have letter within the userInputString but in the wrong location || "b","u","l"," "  should eliminate "b","u","l","l"
                if (userInputIndexed[j] === " " && userInputString.includes(hfWords[i].IndexLetter[j])) {
                    isCandidateWord = false;
                    break;
                }

                // if the possible candidate has letters in the incorrectLetters then isCandidate= false
                for (k = 0; k < incorrectLetters.length; k++) {
                    if (!hfWords[i].Word.includes(incorrectLetters[k])) {
                        // console.log(!lettersGuessed.includes(userInputSet[i]))
                    } else {
                        isCandidateWord = false;
                        break;
                    }
                }
            }

            //If the word is a candidate, add it to the candidate list and add the set of letters to the letter list
            if (isCandidateWord === true) {
                candidateWords.push(hfWords[i])
                // allLettersFromValidWords =[...hfWords[i].Set]
                for (j = 0; j < hfWords[i].Set.length; j++) {
                    var letterCheck = /^[a-zA-Z]+$/; //only alpha
                    if (letterCheck.test(hfWords[i].Set[j])) {  //Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
                        allLettersFromValidWords += hfWords[i].Set[j]
                    }
                    //console.log(hfWords[i].Set)
                }
            } else {
                eliminatedWords.push(hfWords[i])
            }
        }
    }
    console.log("this is candidate words: ", candidateWords);
    console.log("this is eliminated words: ", eliminatedWords);
    //console.log("this is a candidate word:", candidateWords[0].Word)
    console.log("this is alllettersfromvalidword", allLettersFromValidWords)
    //console.log(countLetters(allLettersFromValidWords))

makeAGuess(countLetters(allLettersFromValidWords), userInputString);
}

function messages(theGuess){
    let messageToUser =
        '<div >' +
        `<h1><p> Does your word have the letter ${theGuess} ?</p></h1>` +
        '</div>'
    message.innerHTML = messageToUser;
    statsInfo();


}


function getUserInput() {
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
    console.log("user input in various forms", i, userInputJSON, userInputString, userInputLetterArray, userInputSet)
    candidateWords = []
    eliminatedWords = []

    for (i = 0; i < lettersGuessed.length; i++) {
        if (!userInputString.includes(lettersGuessed[i]) && !incorrectLetters.includes(lettersGuessed[i])) {
            incorrectLetters.push(lettersGuessed[i])
        }
        if (!userInputString.includes(lettersGuessed[i]) && !masterIncorrectLetters.includes(lettersGuessed[i])) {
            masterIncorrectLetters.push(lettersGuessed[i])
        }
    }
    analyzeWords(userInputWordLength, userInputJSON, userInputString, userInputLetterArray, userInputSet)
}


document.getElementById("newGame").onclick = function () {    //sets the wordlength variable upon new game click and sets the html for gameplay
    userInputWordLength = document.getElementById("numberOfLetters").value; //gets value of user input text box

    //builds the form that user will use to input responses
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
    lettersGuessed = []
    masterIncorrectLetters = []
    let tempUserInputLetterArray = [];
    let tempUserInputJSON = new Map();
    let tempUserInputString= tempUserInputLetterArray.join()
    let tempUserInputSet = new Set();
    for (let i=0;i<userInputWordLength;i++){
        tempUserInputLetterArray.push(" ");
        tempUserInputJSON[i] = " "
        tempUserInputSet.add(" ")
    }
    // console.log(tempUserInputLetterArray, tempUserInputLetterArray,tempUserInputSet, tempUserInputJSON )
    analyzeWords(userInputWordLength, tempUserInputJSON, tempUserInputString, tempUserInputLetterArray, tempUserInputSet)
    
    document.getElementById("submitLettersButton").onclick = function () {
        console.log("Submit was clicked")
        incorrectLetters = []
        getUserInput();
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

function statsInfo() {
    let stats ='<div >'
    stats += `<p> Your word is ${userInputWordLength} letters long.</p>`+

        `<p> You have provided me ${userInputWordLength} letters .</p>` 

    if(masterIncorrectLetters.length!=incorrectLetters.length){
        stats += "You changed your mind on on a letter. That's ok... but the stats might be slightly off"}

    stats +=  `<p> I have guessed ${lettersGuessed.length} time(s) and they are ${lettersGuessed}.</p>` +
        `<p> I have guessed incorrectly ${incorrectLetters.length} time(s) given that you've said the following letters are incorrect: ${incorrectLetters}</p>` +
        `<p> At the present time, I feel 100% confident that I will guess your word in X or fewer errors</p>`+
        `<p> At the present time I feel that I will likely guess your word using X or fewer errors </p>`+
        '</div>'
    statsBox.innerHTML = stats;
}

