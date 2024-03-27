let correctAnswerWord;
function $(e){return document.getElementById(e)}
function wait(timeout, fn){
    let seconds = parseFloat(timeout);
    if (timeout.endsWith('s')) {
        seconds = parseFloat(timeout.slice(0, -1));
    }
    let milliseconds = seconds * 1000;
    console.log(milliseconds)
    setTimeout(fn, milliseconds); // Pass fn without invoking it
}
function switchToSet(e){
    let set=e
    localStorage.setItem('set', set)
    load()
    correctNum=0;
    incorrectNum=0;
}
function load(){
    $('correct').innerHTML=correctNum;
    $('incorrect').innerHTML=incorrectNum;
    let percentage=((correctNum/(correctNum+incorrectNum))*100).toFixed(2);
    isNaN(percentage)?percentage=0:percentage=parseFloat(percentage)
    $('percentage').innerHTML=percentage
    for (let i = 1; i <= 4; i++) {
        const element = $(`answer${i}`);
        element.classList.remove('correct');
    }
    let set = localStorage.getItem('set');
    if (set==null){
        set=1
        localStorage.setItem('set', set)
    } else{
        set=Math.floor(set)
    }
    fetch(`testset${set}.json`).then(response => response.json()).then(data => {
        const definitions = data.dictionary;
        const shuffledDefinitions = definitions.sort(() => Math.random() - 0.5);
    
        // Pick a random definition
        const randomIndex = Math.floor(Math.random() * definitions.length);
        const selectedDefinition = definitions[randomIndex];
        correctAnswerWord=definitions[randomIndex].word
        shuffledDefinitions.splice(randomIndex, 1)
    
        // Set the question
        $('question').textContent = selectedDefinition.definition;
    
        // Set the correct answer
        const correctAnswerIndex = Math.floor(Math.random() * 4) + 1; // Random index between 1-4
        const correctAnswerElement = $(`answer${correctAnswerIndex}`);
        correctAnswerElement.querySelector('span').textContent = selectedDefinition.word;
        correctAnswerElement.classList.add('correct');
    
        // Set the other answers
        let otherAnswersIndex = 0;
        for (let i = 1; i <= 4; i++) {
            if (i !== correctAnswerIndex) {
            const otherAnswerElement = $(`answer${i}`);
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
    let element=$(`answer${boxIndex}`)
    if (element.classList.contains('correct')){
        actuallyClicked=true;
        correct()
    } else{
        actuallyClicked=true;
        incorrect()
    }
}

let correctNum = 0;
let incorrectNum = 0;

function correct(){
    if (actuallyClicked){
        actuallyClicked=false;
        $('question').innerHTML="Correct!"
        correctNum++;
        let audio = new Audio('correct.mp3');
        audio.play();
        wait('2.5s', load);
    }
}
function incorrect(){
    if (actuallyClicked){
        actuallyClicked=false;
        let currentVal = $('question').innerHTML;
        incorrectNum++;
        $('question').innerHTML="Incorrect, try again..."
        wait('2.5s', () => {
            $('question').innerHTML = currentVal;
        });
    }
}