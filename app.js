//let word = "continent";
//for (i=0;i<hfWords.length;i++){console.log(hfWords[i].Word)}
randomNumber = Math.floor(Math.random() * hfWords.length); 
let word = hfWords[randomNumber].Word;
console.log(hfWords[randomNumber].Word)
console.log(hfWords[randomNumber].WordLength)
console.log(hfWords[randomNumber].IndexLetter)
console.log(hfWords[randomNumber].Set)
console.log(hfWords[randomNumber].Letters)

let listOfWords = []
for(i=0;i<hfWords.length;i++){if(hfWords[i].WordLength === 14){listOfWords.push(hfWords[i])}}
 console.log(listOfWords)



const definitionApiIntro = document.querySelector('.definitionApiIntro');
const definitionApiWord = document.querySelector('.definitionApiWord');
const definitionApiDefinitions = document.querySelector('.definitionApiDefinitions');
document.getElementById("newGame").onclick = function(){    //sets the wordlength variable upon new game click
let wordLength = console.log(document.getElementById("numberOfLetters").value);
console.log('hello')
}
    // $.ajax({
    //   url: 'https://randomuser.me/api/',
    //   dataType: 'json',
    //   success: function(data) {
    //     document.body.style.backgroundColor = rgb();
    //     console.log(document.body.style.backgroundColor);

function fetchData(url){ // Will use this as a general fetch -ex: dictionary def, wikipedia image possibly
    return fetch(url)
    .then(checkStatus) //looks for status errors
    .then(res => res.json()) // parses
    .catch(error => console.log('There was a problem attempting to retrieve this information:', error))
}



fetchData(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`) //fetch for dictionary definition
.then(data => generateDefinitionDisplay(data))



function generateDefinitionDisplay(data){  //displays the dictionary definition
    console.log(data);
    if(data[0] || data[0].shortdef[0]){    //checks to make sure a valid definition came through and not suggestions     
        definitionApiWord.innerHTML = "I'm not saying this is your word, but it could be: " + word; //data[0].hwi.hw;  // + " " + data[0].shortdef[0]; //word
        let listOfDefinitions = "";
        for(let i=0;i<data[0].shortdef.length;i++){listOfDefinitions+= i+1 + ".) " + data[0].shortdef[i] + " "}
        definitionApiDefinitions.innerHTML = "Definition: " + listOfDefinitions;
    }else{
        console.log("A minor error: A single definition didn't come through")
        definitionApiWord.innerHTML = "The dictionary is not pleased"
    
    }


}

function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);

    }else{
        return Promise.reject(new Error(reponse.statusText));
    }

}






// console.log(window.words)