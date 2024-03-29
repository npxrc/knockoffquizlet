function $(e){return document.getElementById(e)}
window.onload=()=>{
    setRemovable()
    $('input1').value="";
    $('input2').value="";
    $('input1').focus();
    $('input1').addEventListener('keydown', (event)=>{
        if (event.key=="Enter"){
            $('input2').focus()
        }
    })
    $('input2').addEventListener('keydown', (event)=>{
        if (event.key=="Enter"){
            saveToLocalStorage()
        }
    })
}
function saveToLocalStorage() {
    // Get values from input fields
    const input1Value = document.getElementById('input1').value;
    const input2Value = document.getElementById('input2').value;

    if (input1Value.length<2||input2Value.length<4){
        alert('enter real words bruh');
        return;
    }

    // Retrieve existing data from local storage
    let otherPairs = localStorage.getItem('otherPairs');

    // Parse existing data as JSON or initialize an empty array
    otherPairs = otherPairs ? JSON.parse(otherPairs) : [];

    // Create a new attempt object
    const newPair = {
        word: input1Value,
        definition: input2Value
    };

    // Add the new attempt to the array
    otherPairs.push(newPair);

    // Save the updated array back to local storage
    localStorage.setItem('otherPairs', JSON.stringify(otherPairs));

    alert('Pair saved locally!');
    setRemovable();
    $('input1').value="";
    $('input2').value="";
    $('input1').focus()
}
function back(){
    let toGo = document.createElement('a');
	toGo.href = "../"
	toGo.click()
}

$('createPair').style.display="block";
$('removePair').style.display="none";
let visible='create'
function switchMode(){    
    if (visible=='create'){
        $('createPair').style.display="none";
        $('removePair').style.display="block";
        visible='remove'
    } else if (visible=='remove'){
        $('createPair').style.display="block";
        $('removePair').style.display="none";
        visible='create'
    }
}
let removable = [];

function setRemovable() {
    let previousAttempts = localStorage.getItem('otherPairs');
    previousAttempts = previousAttempts ? JSON.parse(previousAttempts) : [];
    console.log(previousAttempts);
    if (previousAttempts.length > 0) {
        $('listOPairs').innerHTML = "";
        for (let i = 0; i < previousAttempts.length; i++) {
            let toPush = {
                word: previousAttempts[i].word,
                definition: previousAttempts[i].definition
            };

            let page = document.createElement('div');
            page.innerHTML = `<p>${toPush.word}<span class="small">- ${toPush.definition}</span></p>`;
            
            // Add a button to remove the specific attempt
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('remove')
            deleteButton.addEventListener('click', function() {
                removeAttempt(i);
            });

            // Append the delete button to the page
            page.appendChild(deleteButton);

            $('listOPairs').appendChild(page);
        }
    }
}
function removeAttempt(index) {
    let previousAttempts = localStorage.getItem('otherPairs');
    previousAttempts = previousAttempts ? JSON.parse(previousAttempts) : [];
    
    // Remove the attempt at the specified index
    previousAttempts.splice(index, 1);

    // Save the updated array back to local storage
    localStorage.setItem('otherPairs', JSON.stringify(previousAttempts));

    // Update the displayed otherPairs
    localStorage.setItem('toRemove','yes')
    location.reload()
}

if (localStorage.getItem('toRemove')=='yes'){
    localStorage.removeItem('toRemove');
    switchMode()
}