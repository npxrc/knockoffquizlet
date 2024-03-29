let correctAnswerWord;
function load(){
    fetch('set.json').then(response => response.json()).then(data => {
        const definitions = data.dictionary;
        const shuffledDefinitions = definitions.sort(() => Math.random() - 0.5);
    
        // Pick a random definition
        const randomIndex = Math.floor(Math.random() * definitions.length);
        const selectedDefinition = definitions[randomIndex];
        correctAnswerWord=definitions[randomIndex].word
        shuffledDefinitions.splice(randomIndex, 1)
    
        // Set the question
        document.getElementById('question').textContent = selectedDefinition.definition;
    
        // Set the correct answer
        const correctAnswerIndex = Math.floor(Math.random() * 4) + 1; // Random index between 1-4
        const correctAnswerElement = document.getElementById(`answer${correctAnswerIndex}`);
        correctAnswerElement.querySelector('span').textContent = selectedDefinition.word;
        correctAnswerElement.classList.add('correct');
    
        // Set the other answers
        let otherAnswersIndex = 0;
        for (let i = 1; i <= 4; i++) {
            if (i !== correctAnswerIndex) {
            const otherAnswerElement = document.getElementById(`answer${i}`);
            otherAnswerElement.querySelector('span').textContent = shuffledDefinitions[otherAnswersIndex].word;
            otherAnswersIndex++;
            }
        }
    })
}
window.onload=()=>load()

let actuallyClicked=false;
setInterval(() => {
    actuallyClicked=false;
}, 1);
function checkAnswer(boxIndex){
    let element=document.getElementById(`answer${boxIndex}`)
    if (element.classList.contains('correct')){
        actuallyClicked=true;
        correct()
    } else{
        actuallyClicked=true;
        incorrect()
    }
}

function correct(){
    if (actuallyClicked){
        actuallyClicked=false;
        document.getElementById('correct').classList.remove('hidden');
    }
}