function $(e){return document.getElementById(e)}

let audioDisabled = false;
if (localStorage.getItem('audioDisabled')=='true'){
    audioDisabled=true;
} else{
    localStorage.setItem('audioDisabled', 'false')
}

$('accessKeyInput').addEventListener('keydown', function(e){
    if (e.key=="Enter"){
        submitAccessKey()
    }
})

function forkMe(){
    window.open('https://github.com/npxrc/knockoffquizlet')
}

function wait(timeout, fn){
    let seconds = parseFloat(timeout);
    if (timeout.endsWith('s')) {
        seconds = parseFloat(timeout.slice(0, -1));
    }
    let milliseconds = seconds * 1000;
    console.log(milliseconds)
    setTimeout(fn, milliseconds); // Pass fn without invoking it
}

let correctAnswerWord;

function shuffle(array) {
    let currentIndex = array.length;
    
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
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
    let key=$('accessKeyInput').value.toLowerCase()
    if (key.length==0){
        alert('Please enter an access key.')
        return
    }
    if (key=="english"){
        localStorage.setItem('accessKey', key)
        hasAccessKey=true;
        location.reload()
    } else{
        alert('Invalid access key.')
    }
}
function flipFlashCard(){
    if ($('question').classList.contains('showingDef')){
        $('question').classList.remove('showingDef')
        $('question').classList.add('showingWord')

        $('question').innerHTML=$('question').attributes.getNamedItem('word').value
    } else if ($('question').classList.contains('showingWord')){
        $('question').classList.remove('showingWord')
        $('question').classList.add('showingDef')

        $('question').innerHTML=$('question').attributes.getNamedItem('definition').value
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
        if (definitions[randomIndex].type=="flashcard"){
            definitions.splice(randomIndex, 1)
            $('question').setAttribute('word', correctAnswerWord)
            $('question').innerHTML = selectedDefinition.definition;
            $('question').addEventListener('click', flipFlashCard);
            $('answer1').innerHTML="i understand this!!!"
            $('question').classList.add('showingDef')
            $('question').setAttribute('definition', selectedDefinition.definition)
            $('answer1').classList.add('flashcard')
            $('answer1').classList.add('correct')
            $('answer2').style.visibility="hidden"
            $('answer3').style.visibility="hidden"
            $('answer4').style.visibility="hidden"
        } else{
            $('question').removeEventListener('click', flipFlashCard, true);
            definitions.splice(randomIndex, 1)
        
            // Set the question
            $('question').textContent = selectedDefinition.definition;
        
            // Set the correct answer
            const correctAnswerIndex = Math.floor(Math.random() * 4) + 1; // Random index between 1-4
            const correctAnswerElement = $(`answer${correctAnswerIndex}`);
            correctAnswerElement.querySelector('span').textContent = selectedDefinition.word;
            correctAnswerElement.classList.add('correct');
            $('answer1').classList.remove('flashcard')
        
            // Set the other answers
            let otherAnswersIndex = 0;
            for (let i = 1; i <= 4; i++) {
                if (i !== correctAnswerIndex) {
                    const otherAnswerElement = $(`answer${i}`);
                    otherAnswerElement.querySelector('span').textContent = definitions[otherAnswersIndex].word;
                    otherAnswersIndex++;
                }
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
        if (!audioDisabled){
            audio.play();
        }
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
    if ($('mobileMenu').value=="mobileFork"){
        location.href="https://github.com/npxrc/knockoffquizlet"
    } else if ($('mobileMenu').value=="disableAudio"){
        audioDisabled=true
        localStorage.setItem('audioDisabled', true)
    } else if($('mobileMenu').value=="enableAudio"){
        audioDisabled=false
        localStorage.setItem('audioDisabled', false)
    }
})