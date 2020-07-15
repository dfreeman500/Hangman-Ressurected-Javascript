let gamePlay = document.querySelector('.gamePlay');
const definitionApiIntro = document.querySelector('.definitionApiIntro');
const definitionApiWord = document.querySelector('.definitionApiWord');
const definitionApiDefinitions = document.querySelector('.definitionApiDefinitions');
const statsBox = document.querySelector('.StatsBox');
const message = document.querySelector('.Messages');
const UpperWaterfall = document.querySelector('.UpperWaterfall');
const LowerWaterfall = document.querySelector('.LowerWaterfall');


let wordLists = [hfWords, bigWords]; //List of variable pointing to the different word lists
var candidateWords = []
let eliminatedWords = []

var lettersGuessed = []
var incorrectLetters = []
var masterIncorrectLetters = []

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
            //console.log("This is the masterIncorrectLetters array:", masterIncorrectLetters, " length: ", masterIncorrectLetters.length)
            console.log("This is my guess:", arrayOfLettersByFrequency[i])
            return theGuess = arrayOfLettersByFrequency[i]
        }
    }
}

//Determines which word is a candidate and which can be ruled out
function analyzeWords(userWordLength, userInputString, incorrectLetters, masterIncorrectLetters) {
    //console.log("inside analyze words function: userWordLength:", userWordLength, "userInputString", userInputString, "userInputLetterArray", userInputIndexed, "userInputSet", userInputSet)
    allLettersFromValidWords = []
    letterFrequency = []
    var wordFullyGuessed = false;
    //userInputString = "phone";
    //Consider using filter method here????
    for (i = 0; i < hfWords.length; i++) {
        var isCandidateWord = true;
        if (hfWords[i].WordLength == userWordLength) {
            for (let j = 0; j < userWordLength; j++) { //iterates through each possible word to find candidate
                if (userInputString[j] === " " || userInputString[j] == hfWords[i].Word[j]) {
                    //console.log(isCandidateWord)
                } else {
                    isCandidateWord = false;
                    break;
                }

                //Elminates words that have letter within the userInputString but in the wrong location || "b","u","l"," "  should eliminate "b","u","l","l"
                if (userInputString[j] === " " && userInputString.includes(hfWords[i].Word[j])) {
                    isCandidateWord = false;
                    break;
                }

                // if the possible candidate has letters in the incorrectLetters then isCandidateWord= false
                for (k = 0; k < incorrectLetters.length; k++) {
                    if (!hfWords[i].Word.includes(incorrectLetters[k])) {
                        // console.log(!lettersGuessed.includes(userInputSet[i]))
                    } else {
                        isCandidateWord = false;
                        break;
                    }
                }
                incorrectLetters;
                masterIncorrectLetters;
                candidateWords;
                eliminatedWords;
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
    console.log("this is alllettersfromvalidwords", allLettersFromValidWords)
    //console.log(countLetters(allLettersFromValidWords))
    incorrectLetters;
    masterIncorrectLetters;
    return { candidateWords, eliminatedWords, allLettersFromValidWords, wordFullyGuessed, incorrectLetters, masterIncorrectLetters }
}

//Controls the message in the message box, let vs var  messageToUser will reduce repetition
function messages(info, userInputString, candidateWords) {
    console.log("The messages function ran", info, userInputString, candidateWords)
    if (info == true) {
        let messageToUser =
            '<div >' +
            `<h1><p> I have guessed your word. It is ${userInputString}</p></h1>` +
            '</div>'
        message.innerHTML = messageToUser;
    } else if (candidateWords.length == 0) {
        console.log("The info was undefined", info)
        let messageToUser =
            '<div >' +
            `<h1><p> Something went Wrong!! Are you sure you told me the correct letters. Look over the letters I've already guessed to make sure. Are you having me guess a real word?</p></h1>` +
            '</div>'
        message.innerHTML = messageToUser;
    }
    else if (info == false) {
        console.log("The messages function ran down here", info, userInputString, candidateWords)
        let messageToUser =
            '<div >' +
            `<h1><p> Please only give me lower case letters</p></h1>` +
            '</div>'
        message.innerHTML = messageToUser;
    } else if (info == "invalidWordLength") {
        console.log("The messages function ran down here", info, userInputString, candidateWords)

        let messageToUser =
            '<div >' +
            `<h1><p> It doesn't look like you have a real word in mind. Please give me a number above 0 and one that corresponds to the length of a real word</p></h1>` +
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
}

//Takes multiple user inputs, checks for valid inputs, and generates the userInputString
function compileUserInput(userInputWordLength) {
    var userInputString = "";
    if (firstRun == true) {
        console.log("The firstRun is true - first run for start of game")
        for (i = 0; i < userInputWordLength; i++) {
            userInputString += " ";
            //userInputSet.add(userInputString[i]);
        }
        firstRun = false;
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
            console.log("2 - userINputstring is now:", userInputString)
        }
    }
    console.log("user input in various forms", i, "userInputString:", userInputString, "userINputString length:", userInputString.length)
    candidateWords = []
    eliminatedWords = []


    console.log("This should be exiting")
    return { userInputString }
}

function determineListOfIncorrectLetters(userInputString, incorrectLetters, masterIncorrectLetters) {
    incorrectLetters;
    masterIncorrectLetters;
    for (i = 0; i < lettersGuessed.length; i++) {
        if (!userInputString.includes(lettersGuessed[i]) && !incorrectLetters.includes(lettersGuessed[i])) {
            incorrectLetters.push(lettersGuessed[i])
        }
        try {
            if (!userInputString.includes(lettersGuessed[i]) && !masterIncorrectLetters.includes(lettersGuessed[i])) {
                masterIncorrectLetters.push(lettersGuessed[i])
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }
    return { incorrectLetters, masterIncorrectLetters }
}

function orderOfOperations(userInputString, incorrectLetters, masterIncorrectLetters, lettersGuessed, firstRun) {
    var { userInputString } = compileUserInput(userInputWordLength, firstRun);
    var { incorrectLetters, masterIncorrectLetters } = determineListOfIncorrectLetters(userInputString, incorrectLetters = [], masterIncorrectLetters = []);
    var { candidateWords, eliminatedWords, allLettersFromValidWords, wordFullyGuessed, incorrectLetters, masterIncorrectLetters } = analyzeWords(userInputWordLength, userInputString, incorrectLetters, masterIncorrectLetters)
    chooseDefinedWord(makeAGuess(countLetters(allLettersFromValidWords), userInputString))
    messages(theGuess, userInputString, candidateWords)

    if (wordFullyGuessed == true) {
        messages(wordFullyGuessed, userInputString, candidateWords)
        try {

            fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${userInputString}?key=${apiKey}`) //fetch for dictionary definition
                .then(data => generateDefinitionDisplay(data, wordFullyGuessed, userInputString))
        }
        catch (err) {
            console.log(err.message);
        }
    };
    console.log("after analyze words", "userInputString:", userInputString, "userINputString length:", userInputString.length)
    waterfalls(candidateWords, eliminatedWords)
    statsInfo(userInputString, candidateWords, incorrectLetters, masterIncorrectLetters)

}

//Takes the user input (word length) and determines if this is going to be a valid word
function wordLengthValidator(userInputWordLength) {
    validWordLength = false;
    //var wordLengthSet = new Set();
    var testCondition = /^\d+$/; //only numerics
    if (!testCondition.test(userInputWordLength)) {  //Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
        return validWordLength
    }
    for (let i = 0; i < hfWords.length; i++) {
        //console.log(hfWords[i].WordLength)
        if (userInputWordLength == hfWords[i].WordLength) {
            validWordLength = true;
            //console.log("break now")
            return validWordLength;
        }
    }
    return validWordLength;
}
function buildGamePlayBox(userInputWordLength) {
    //builds the form that user will use to input responses
    var html = "";
    html += '<div class="containsLetters">'
    for (var i = 0; i < userInputWordLength; i++) {
        html +=
            '<div class="letterBox" >' +
            `<form >` +
            `<input type="text" id="${i}"  maxlength="1">` +
            '</div>'
    }
    html += '</div>'
    html += '<button type="button" id="submitLettersButton">Add letters if appropriate and then submit</button>' + '</form>';
    gamePlay.innerHTML = html;  //injects the html into the gameplay section
    lettersGuessed = []
    var masterIncorrectLetters = []
    incorrectLetters = []
    var userInputString = "";
    //var userInputSet = new Set();
    return userInputString
}


document.getElementById("newGame").onclick = function () {    //sets the wordlength variable upon new game click and sets the html for gameplay
    userInputWordLength = document.getElementById("numberOfLetters").value; //gets value of user input text box

    if (wordLengthValidator(userInputWordLength) == false) {
        messages("invalidWordLength", userInputString = 0, candidateWords = 0)
    } else {
        userInputString = buildGamePlayBox(userInputWordLength)
        orderOfOperations(userInputString, incorrectLetters, masterIncorrectLetters, lettersGuessed, firstRun = true)
    }
    document.getElementById("submitLettersButton").onclick = function () {
        console.log("Submit was clicked")
        incorrectLetters = []
        masterIncorrectLetters
        orderOfOperations(userInputString, incorrectLetters, masterIncorrectLetters, lettersGuessed, firstRun = false)
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

function statsInfo(userInputString, candidateWords, incorrectLetters, masterIncorrectLetters) {
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
    stats += `<p> Your word is ${userInputWordLength} letters long.</p>` +

        `<p> You have provided me ${numberOfLettersGivenByUser} of the ${userInputWordLength} letters: ${userInputString}</p>`

    // try {
    if (masterIncorrectLetters.length != incorrectLetters.length) {
        stats += "You changed your mind on on a letter. That's ok... but the stats might be slightly off"
    }

    // } catch (err) {
    //     console.log(err.message);
    // }



    stats += `<p> I have guessed ${lettersGuessed.length} time(s) and they are ${lettersGuessed}.</p>` +
        `<p> I have guessed incorrectly ${incorrectLetters.length} time(s) given that you've said the following letters are incorrect: ${incorrectLetters}</p>` +
        `<p> At the present time, I feel 100% confident that I will guess your word in ${(Math.max(...listOfErrorNumbers) > incorrectLetters.length ? Math.max(...listOfErrorNumbers) : incorrectLetters.length)} or fewer errors</p>` +
        `<p> At the present time I feel that I will <b>likely</b> guess your word using ${((Math.ceil(sum / candidateWords.length)) > incorrectLetters.length ? (Math.ceil(sum / candidateWords.length)) : incorrectLetters.length)} or fewer errors </p>` +
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
                        .then(data => generateDefinitionDisplay(data))
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

