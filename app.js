let word = "continent";

const definitionApiIntro = document.querySelector('.definitionApiIntro');
const definitionApiWord = document.querySelector('.definitionApiWord');
const definitionApiDefinitions = document.querySelector('.definitionApiDefinitions');


function fetchData(url){ // Will use this as a general fetch -ex: dictionary def, wikipedia image possibly
    return fetch(url)
    .then(checkStatus)
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






console.log(window.words)