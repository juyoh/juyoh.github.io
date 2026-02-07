let date = new Date()
let day = date.getDay()
if (day === 6) {
    caturday()
} else {
    countdownUntilCaturday(6 - day)
}

removeJSError()

//credit to https://music.arts.uci.edu/dobrian/webaudio/tutorials/WebAudioAPI/playbufferedsound.html
//i didn't want to request a new audio every button hover
const context = new AudioContext(); 
let sourceBuffer = context.createBufferSource();
try {
             
    // Make a place to store the audio
    
    // Prepare to access a URL
    let	request = new XMLHttpRequest();           
    // open file (asynchronously)
    request.open("GET", "/assets/audio/click.mp3", true);
    // expect that it will be binary data, not text
    request.responseType = "arraybuffer";
    // when it loads, we'll put it in an AudioBuffer
    // first create the onload function
    request.onload = function () {
        // put the undecoded audio data in a buffer
        let undecodedAudio = request.response;
        // decode it, then put it in the global sourceBuffer
        context.decodeAudioData(undecodedAudio, function (buffer) {
            sourceBuffer.buffer = buffer;
        });
    };
    // now that the request is prepared, actually send the request 
    request.send();
} catch (Error) {

}

function maybeActivateLeastJoke() {
    // one in 30 chance to get the "worlds least website" bit
    if (Math.floor(Math.random() * 30) == 0) {
        document.getElementById("dumb").style = ""
        document.title = document.title + " - The World's Least Website"
    }
}
			
clickyButton()
dragBegone()
maybeActivateLeastJoke()

function removeJSError() {
    const errorElements = document.getElementsByClassName("js-error")

    for (let index = 0; index < errorElements.length; index++) {
        errorElements.item(index).style = "display: none;"
        console.log("Removed JS error element")
    }
}
function clickyButton() {
    const buttonElements = document.getElementsByClassName("clicky")

    for (let index = 0; index < buttonElements.length; index++) {
        buttonElements.item(index).addEventListener("mouseenter", function () {
        
            let	bufferSrc = context.createBufferSource();
			// point it to the captured, decoded sound
			bufferSrc.buffer = sourceBuffer.buffer;
			// connect it to the output
			bufferSrc.connect( context.destination );
			// play it
			bufferSrc.start(0);
            
        })
    
    }
}

function caturday() {
    document.getElementById("caturday_text").innerText = "Happy Caturday!!!"
    document.getElementById("caturday_text").style.marginTop = "80px"
    document.getElementById("caturday_gif2").style.display = "flex"
    document.getElementById("caturday_gif1").style.display = "flex"
    document.getElementById("caturday_gif3").style.display = "flex"
}
function countdownUntilCaturday(daysLeft) {
    const message = "Only " + daysLeft + " day" + (daysLeft > 1 ? "s" : "") + " until Caturday!"
    document.getElementById("caturday_text").innerText = message
    console.log(message)
}
function dragBegone() {
    const nodragElements = document.getElementsByClassName("nodrag")

    for (let index = 0; index < nodragElements.length; index++) {
        const childrenElements = nodragElements.item(index).childNodes;
        for (let child = 0; child < childrenElements.length; child++) {
            childrenElements.item(child).draggable = 0
        }
    
    }
}