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
function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}
let hasAccessKey = false;
if (localStorage.getItem('accessKey')=="english"){
    hasAccessKey=true;
} else{
    $('accessKey').style.display="block"
    $('question').style.display="none";
    $('answersCont').style.display="none";
    $('mobileMenuContainer').style.display="none";
    $('mobileScore').style.display="none";
    $('desktopScore').style.display="none";
}
function submitAccessKey(){
    let key=$('accessKeyInput').value
    if (key.length==0){
        alert('Please enter an access key.')
        return
    }
    if (key=="english"){
        localStorage.setItem('accessKey', key)
        hasAccessKey=true;
        $('accessKey').style.display="none"
        $('question').style.display="block";
        $('answersCont').style.display="block";
        $('mobileMenuContainer').style.display="block";
        $('mobileScore').style.display="block";
        $('desktopScore').style.display="block";
        load()
    } else{
        alert('Invalid access key.')
    }
}
function load(){
    if (!hasAccessKey){
        $('accessKey').style.display="block"
        $('question').style.display="none";
        $('answersCont').style.display="none";
        $('mobileMenuContainer').style.display="none";
        $('mobileScore').style.display="none";
        $('desktopScore').style.display="none";
        return;
    } else{
        $('accessKey').style.display="none"
    }
    disabled=false;
    $('correct').innerHTML=correctNum;
    $('incorrect').innerHTML=incorrectNum;
    $('correctMobile').innerHTML=correctNum;
    $('incorrectMobile').innerHTML=incorrectNum;
    let percentage=((correctNum/(correctNum+incorrectNum))*100).toFixed(2);
    isNaN(percentage)?percentage=0:percentage=parseFloat(percentage)
    $('percentage').innerHTML=percentage
    $('percentageMobile').innerHTML=percentage
    for (let i = 1; i <= 4; i++) {
        const element = $(`answer${i}`);
        element.classList.remove('correct');
    }
    localStorage.removeItem('set')
    fetch(`../sets/set.json`).then(response => response.json()).then(data => {
        let definitions = data.dictionary;
        console.log(data.dictionary.length)
        shuffle(definitions)
    
        // Pick a random definition
        const randomIndex = Math.floor(Math.random() * definitions.length);
        const selectedDefinition = definitions[randomIndex];
        correctAnswerWord=definitions[randomIndex].word
        for (let i=0;i<lastcorrect.length;i++){
            if (correctAnswerWord==lastcorrect[i]){
                load();
                return;
            }
        }
        definitions.splice(randomIndex, 1)
    
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
            otherAnswerElement.querySelector('span').textContent = definitions[otherAnswersIndex].word;
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
let audio = new Audio('correct.mp3');
let disabled=false;
let lastcorrect = []
let maxLastCorrect=5;

function correct(){
    if (disabled) return;
    if (actuallyClicked){
        actuallyClicked=false;
        disabled=true;
        $('question').innerHTML="Correct!"
        correctNum++;
        for (let i=1;i<5;i++){
            if ($(`answer${i}`).classList.contains('correct')){
                if (lastcorrect.length==maxLastCorrect) lastcorrect.splice(0,1);
                lastcorrect.push($(`answer${i}`).querySelector('span').innerHTML)
            }
        }
        audio.play();
        wait('1s', load);
    }
}
function incorrect(){
    if (disabled) return;
    if (actuallyClicked){
        actuallyClicked=false;
        let currentVal = $('question').innerHTML;
        incorrectNum++;
        $('question').innerHTML="Incorrect, try again..."
        wait('1s', () => {
            $('question').innerHTML = currentVal;
        });
    }
}

setInterval(() => {
    if (window.innerWidth<850){
        document.body.classList.add('mobile')
    } else{
        document.body.classList.remove('mobile')
    }
}, 10);
$('mobileMenu').querySelector('option').click()
setInterval(() => {
    $('mobileMenu').value="nothing"
}, 1);
$('mobileMenu').addEventListener('change',(event)=>{
    if ($('mobileMenu').value=="changepairs"){
        updatePairs()
    } else if ($('mobileMenu').value=="forkjittrippin"){
        location.href="https://github.com/npxrc/knockoffquizlet"
    }
})