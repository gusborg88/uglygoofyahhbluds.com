import ClickableGuy from "./clickableGuy.mjs";

const canvas = document.querySelector('canvas').getContext('2d'),
width = canvas.canvas.width,
height = canvas.canvas.height;
try {
    const image = document.querySelector('img'),
    audio = document.querySelector('audio'),
    output = document.querySelector('output'),
    speedMeter = document.querySelector('[type=range]'),
    note = document.querySelector('#note'),
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
    let bludsClicked = 0, lastClickTime = 0;
    canvas.fillStyle = 'black';
    canvas.fillRect(0, 0, width, height);
    const theDude = new ClickableGuy(
        canvas,
        image,
        image.naturalWidth / 2 - 100,
        50,
        200,
        300,
        0.6
    )
    canvas.fillStyle = 'red';
    image.decode().then(()=>{
        canvas.fillText('click me', theDude.canvasX, theDude.canvasY);
        canvas.fillStyle = 'black';
        theDude.respawnRandom(canvas)
        canvas.canvas.addEventListener('pointerdown', (event)=>{
            const time = performance.now();
            if (inHitbox(event, theDude.hitbox)) {
                audio.currentTime = 0;
                audio.play();
                bludsClicked++;
                for (const [comment, rating] of ratings) {
                    if (bludsClicked > 1000) {
                        bludsClicked = 0;
                        note.textContent = 'You fucking cheater';
                        document.querySelector('canvas').remove();
                        window.open('cheating.html', '_blank', 'popup,width=640,height=360,left=0,top=0');
                    }
                    if (bludsClicked > rating) {
                        note.textContent = comment;
                        break;
                    }
                }
                speedMeter.value = 10 / (time - lastClickTime) * 2000;
                lastClickTime = time;
                output.textContent = bludsClicked;
                theDude.clear();
                theDude.respawnRandom(canvas);
            }
            if (bludsClicked === 20 || bludsClicked === 200 || bludsClicked === 2000) {
                window.open('win.html', '_blank', 'popup=true,width=140,height=80,left=200,top=400');
            }
        })
    });
    /*shucks was made by a 12 year old
    What?????*/
    /**
     * @param {MouseEvent|PointerEvent} event the event which has the x and y coordinates
     * @param {Array<Object>} hitbox from ClickableGuy hitbox property. i wish i had a typescript compiler.
     * @returns {Boolean}
     */
    function inHitbox(event, hitbox) {
        console.log(event.offsetX, hitbox[0].x, hitbox[1].x);
        return event.offsetX < hitbox[1].x && event.offsetX > hitbox[0].x &&
            event.offsetY < hitbox[1].y && event.offsetY > hitbox[0].y;
    }
} catch (error) {
    console.error(error);
    canvas.fillStyle = 'white',
    canvas.fillText('Oh noes! There was a oopsie daisies with the canvas, heres the error >~<', 0, 10, width);
    canvas.fillStyle = 'red';
    canvas.fillText(error, 0, 30, width);
    canvas.fillStyle = 'white';
}