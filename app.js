let gamePlay = document.querySelector('.gamePlay');
const definitionApiIntro = document.querySelector('.definitionApiIntro');
const definitionApiWord = document.querySelector('.definitionApiWord');
const definitionApiDefinitions = document.querySelector('.definitionApiDefinitions');
const statsBox = document.querySelector('.StatsBox');
const message = document.querySelector('.Messages');
const UpperWaterfall = document.querySelector('.UpperWaterfall');
const LowerWaterfall = document.querySelector('.LowerWaterfall');


let userInputJSON;
let wordLists = [hfWords, bigWords]; //List of variable pointing to the different word lists
var candidateWords = []
let eliminatedWords = []

var lettersGuessed = []
var incorrectLetters = []
var letterFrequency = []

var userInputWordLength;
let listOfWords = []

// function hangmanStartup(){
//     let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
// var html = "this is it";
// gamePlay.innerHTML = html;  //injects the html into the gameplay section

// while(html != "h"){

//     setTimeout(() => {  html = alphabet[Math.floor(Math.random() * alphabet.length)]}, 250);
//     gamePlay.innerHTML = html;  //injects the html into the gameplay section

// }
// }
// hangmanStartup()

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
    messages(theGuess, userInputString, candidateWords)
}




//Determines which word is a candidate and which can be ruled out
function analyzeWords(userWordLength, userInputIndexed, userInputString, userInputLetterArray, userInputSet) {
    console.log("inside analyze words function: userWordLength:", userWordLength, "userInputString", userInputString, "userInputLetterArray", userInputIndexed, "userInputSet", userInputSet)
    allLettersFromValidWords = []
    letterFrequency = []
    var wordFullyGuessed = false;

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

            if (hfWords[i].Word === userInputString) {
                console.log("The candidate word:", hfWords[i].Word, "matches the userString", userInputString);
                wordFullyGuessed = true;
            }
        }
    }
    console.log("this is candidate words: ", candidateWords);
    console.log("this is eliminated words: ", eliminatedWords);
    //console.log("this is a candidate word:", candidateWords[0].Word)
    console.log("this is alllettersfromvalidword", allLettersFromValidWords)
    //console.log(countLetters(allLettersFromValidWords))


    waterfalls(candidateWords, eliminatedWords)

    if (wordFullyGuessed == false) {
        makeAGuess(countLetters(allLettersFromValidWords), userInputString)
    } else {
        messages(wordFullyGuessed, userInputString, candidateWords)
        try {

            fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${userInputString}?key=${apiKey}`) //fetch for dictionary definition
                .then(data => generateDefinitionDisplay(data, wordFullyGuessed, userInputString))
        }
        catch (err) {
            console.log(err.message);
        }
    };
    statsInfo(userInputString)
}

//Controls the message in the message box, let vs var  messageToUser will reduce repetition
function messages(info, userInputString, candidateWords) {
    if (info == true) {
        let messageToUser =
            '<div >' +
            `<h1><p> I have guessed your word. It is ${userInputString}</p></h1>` +
            '</div>'
        message.innerHTML = messageToUser;

    } else if (info == null) {
        console.log("The info was undefined", info)
        let messageToUser =
            '<div >' +
            `<h1><p> Something went Wrong!! Are you sure you told me the correct letters. Look over the letters I've already guessed to make sure. Are you having me guess a real word?</p></h1>` +
            '</div>'
        message.innerHTML = messageToUser;

    }
    else {
        let messageToUser =
            '<div >' +
            `<h1><p> Does your word have the letter ${info} ?</h1>`
        if (candidateWords != null) {
            console.log("It's not null")

        } else { console.log("it is null") }

        if (candidateWords != null && candidateWords.length == 1) {
            messageToUser += `<h1>Because I'm thinking your word is ... ${candidateWords[0].Word}.</h1>`
            console.log("this is what I'm trying to pring", candidateWords[0])

        }
        messageToUser += '</p></div>'

        message.innerHTML = messageToUser;

    }
    statsInfo(userInputString);

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


//Need to consolidate userinput... and tempUserInput... into single function

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
    incorrectLetters = []
    let tempUserInputLetterArray = [];
    let tempUserInputJSON = new Map();
    let tempUserInputString = tempUserInputLetterArray.join()
    let tempUserInputSet = new Set();
    for (let i = 0; i < userInputWordLength; i++) {
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

function generateDefinitionDisplay(data, wordFullyGuessed, userInputString) {  //displays the dictionary definition
    //console.log(data);
    if (data[0] || data[0].shortdef[0]) {    //checks to make sure a valid definition came through and not suggestions     
        if (wordFullyGuessed == true) {
            definitionApiWord.innerHTML = `Your word is ${userInputString}:`
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

function statsInfo(userInputString) {

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
    stats += `<p> Your word is ${userInputWordLength} letters long.</p>` +

        `<p> You have provided me ${numberOfLettersGivenByUser} of the ${userInputWordLength} letters .</p>`

    if (masterIncorrectLetters.length != incorrectLetters.length) {
        stats += "You changed your mind on on a letter. That's ok... but the stats might be slightly off"
    }


    stats += `<p> I have guessed ${lettersGuessed.length} time(s) and they are ${lettersGuessed}.</p>` +
        `<p> I have guessed incorrectly ${incorrectLetters.length} time(s) given that you've said the following letters are incorrect: ${incorrectLetters}</p>` +
        `<p> At the present time, I feel 100% confident that I will guess your word in ${Math.max(...listOfErrorNumbers)} or fewer errors</p>` +
        `<p> At the present time I feel that I will likely guess your word using ${Math.ceil(sum / candidateWords.length)} or fewer errors </p>` +
        '</div>'
    statsBox.innerHTML = stats;
}


function waterfalls(candidateWords, eliminatedWords) {
    let candidateWordsVariable
    if (candidateWords != null) {
        for (let i = 0; i < candidateWords.length; i++) {

            candidateWordsVariable += `<a id=${candidateWords[i].Word} href=#>${candidateWords[i].Word}</a>`
            candidateWordsVariable += " "
            //append child //create element     
            // https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
        }
        UpperWaterfall.innerHTML = candidateWordsVariable;
        for (let i = 0; i < candidateWords.length; i++) {

            try {
                document.getElementById(candidateWords[i].Word).onclick = function () {
                    fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${candidateWords[i].Word}?key=${apiKey}`) //fetch for dictionary definition
                        .then(data => generateDefinitionDisplay(data))
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }
    }

    let eliminatedWordsVariable
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
                        .then(data => generateDefinitionDisplay(data))
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }
    }
}

