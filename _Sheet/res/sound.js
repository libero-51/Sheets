
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
//  ( "Webkit/blink browsers need prefix, Safari won't work without window.")


var masterGain = audioContext.createGain();
    masterGain.gain.value = 1;
masterGain.connect(audioContext.destination);

var nodeGain1 = audioContext.createGain();
    nodeGain1.gain.value = 1;
nodeGain1.connect(masterGain);


function Buzz( frequency,length,t) {
    let type
    switch(t){
    case 0:type='sine'    ;break;
    case 1:type='square'  ;break;
    case 2:type='sawtooth';break;
    case 3:type='triangle';break;
    case 4:type='custom'  ;break;
    }
    var oscillatorNode = new OscillatorNode(audioContext, {type: type});
    oscillatorNode.frequency.value = frequency;
    oscillatorNode.connect( nodeGain1);
    oscillatorNode.start(audioContext.currentTime);
    //setTimeout( function(){oscillatorNode.stop();}, length*1000);
    oscillatorNode.stop( audioContext.currentTime + length);
}

/*
function volume1( rangeInput) {
    masterGain.gain.value = +rangeInput.value;
}

function volume2( rangeInput) {
    nodeGain1.gain.value= +rangeInput.value;
}
*/	
