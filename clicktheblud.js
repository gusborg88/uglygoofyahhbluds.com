const bludzone = document.getElementById('clicktheblud'),
blud = document.createElement('img');
blud.src = 'blud_clickable.png';
blud.style.position = 'relative';
blud.style.width = 'max(10vmin, 30px)';
blud.style.height = 'auto';
bludzone.appendChild(blud);

const image = document.getElementById('ugly'),
audio = document.getElementById('clickAudio'),
output = document.querySelector('output'),
note = document.getElementById('note'),
speedometer = document.getElementById('speedometer'),
ratings = [
    ['Wow so many bluds...', 2000],
    ['Good boy', 1000],
    ['So much click...', 500],
    ['#Epic', 200],
    ['W blud', 100],
    ['holy cr*p', 50],
    ['cool!', 30],
    ['Wowza!', 10],
];

audio.preservesPitch = false;

let bludsClicked = 0, uneditedBludsClicked = 0,
lastClickTime = 0, secondLastClickTime = 0,
edited = false, cheated = false;

/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_0_inclusive_and_1_exclusive
*/

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function bludLogic(event) {
    blud.style.left = Math.random() * 90 + '%';
    blud.style.top = Math.random() * 90 + '%';

    if (event) {
        audio.currentTime = 0;
        audio.playbackRate = getRandomArbitrary(0.99, 1.01);
        audio.play();

        let outValue = parseInt(output.textContent);
        if (outValue !== bludsClicked) {
            if (!edited) {
                edited = true;
                uneditedBludsClicked = outValue;
            }
            
            bludsClicked = outValue;
        }
        
        const time = performance.now();
        speedometer.value = 10 / (time - lastClickTime) * 2000;
        lastClickTime = time;
        bludsClicked++;
        
        for (const [comment, rating] of ratings) {
            output.textContent = bludsClicked;
            
            if (bludsClicked >= rating) {
                note.textContent = comment;
                break;
            }
        }

        /*
         reworked "cheating" stuff
         the way it was doing this before was ehh.. 
         and kinda just capped the game out at 1000 bluds
        */
        
        if (bludsClicked - uneditedBludsClicked >= 12 && edited && !cheated) {
            cheated = true;
            blud.remove();

            bludsClicked = 0;
            output.textContent = bludsClicked;
            
            note.textContent = 'You fucking cheater';
            window.open('cheating.html', 'cheaterPopup', 'popup,width=640,height=360,left=0,top=0');
        }

        let isMilestone = bludsClicked === 20   ||
                          bludsClicked === 200  ||
                          bludsClicked === 2000;
        if (isMilestone) 
            window.open('win.html?bluds='+bludsClicked, 'winPopup'+bludsClicked, 'popup=true,width=140,height=80,left=200,top=400');
    }
}

blud.onmousedown = bludLogic;

/*
 nothing in the parameters!!
 the code looks for the event that onmousedown passes to functions,
 and if there's nothing it doesn't run any "clicked" logic!!
 could think of it as a "miss", obviously thats not what its being-
 - used as here, but you could use it that way too and itd work well enough
*/

bludLogic();
