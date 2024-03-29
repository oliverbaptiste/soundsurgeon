# Soundsurgeon HTML5 Synthesizer

The **JS-11-16 monosynth**: an electronic musical instrument — created with
the [**Web Audio API**](https://webaudio.github.io/web-audio-api/) — that
lives at [soundsurgeon.com](https://soundsurgeon.com).

It began as the final project for the General Assembly _JavaScript Development_
course I took in 2016–17.

------

JavaScript libraries used in this app:

* [Tone.js](https://tonejs.github.io/) for sound synthesis
* [Teoria.js](https://github.com/saebekassebil/teoria)
to generate scales and modes
* [jQuery](https://jquery.com/) for UI & event handling
* [KeyboardJS](https://github.com/RobertWHurst/KeyboardJS)
for advanced keyboard event handling
* [Vite](https://vitejs.dev) build tool

------

The **JS-11-16 monosynth** is a musical instrument that lets a user play an
octave of notes using the home row of a QWERTY keyboard, or via on-screen buttons.

This HTML5 app uses the **Web Audio API** to generate sound in the browser
without using audio files. The Web Audio API allows for subtractive synthesis
in the manner popularized by analog modular synthesizers of the 1960s & 70s:
_Moog_, _Buchla_, et al.

In the Web Audio API, an `AudioContext` object is an audio processing interface
that consists of audio modules connected to each other, like in a modular
synthesizer. These modules — called *nodes* — are created with constructor
methods, while other `AudioContext` methods connect and manipulate the nodes.

```javascript
// create AudioContext
var a = new AudioContext();

// create GainNode
var g = a.createGain();

// create OscillatorNode
var o = a.createOscillator();

// set OscillatorNode.type to 'sine'
o.type = 'sine';

// OscillatorNode.frequency.value in Hertz
o.frequency.value = '1000';

// connect OscillatorNode to GainNode
o.connect(g);

// connect GainNode to AudioDestinationNode
g.connect(a.destination);

// GainNode gain value range: 0 = 0%, 1 = 100%
g.gain.value = 0;

// start OscillatorNode instantly
o.start(0);
```

Tone.js is a framework that abstracts the Web Audio API `AudioContext` and
nodes into the `Tone` object, which contain object types like `Instrument` and
`Effect` that are easier to work with in a musical context. For instance, you
can choose notes using scientific pitch notation to choose frequencies, or
define note duration like you would on a score:

```javascript
// Tone.js "Hello World"

// create a synth and connect it to the destination (your speakers)
var synth = new Tone.Synth().toDestination();

// play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("C4", "8n");

```

In `App.init`, `App.synthObj` is assigned an instance of the `Tone.MonoSynth`
instrument, a monophonic synthesizer composed of:

* one oscillator
* connected to an amplitude envelope
* connected to a filter that is controlled by its own envelope
* connected to the `Tone.Destination` output object.

The [Tone.js API](https://tonejs.github.io/docs/) describes the various methods
and parameters available to `Tone` components. The major `Tone.MonoSynth` sound
parameters are:

* Oscillator
  * Mute button
  * Volume slider
  * Waveforms:
  * Sine
    * Square (default)
    * Triangle
    * Sawtooth
  * Detune
  * Portamento
* Amplitude Envelope
  * Attack
  * Decay
  * Sustain
  * Release
* Filter Envelope
  * Attack
  * Decay
  * Sustain
  * Release
  * “Q”

The user interface used to live in `index.html`, but is now generated via a
template string in `App.view`. HTML5 `<input>` elements are utilized to control
these parameters:

* `checkbox` for the mute button
* `radio` for waveform selection
* `range` sliders for all other parameters

The `App.initControls` method invoked in `App.init` accepts a Tone.js synth
object as an argument, gets the synth's sound parameters, and adjusts the UI to
represent those values using jQuery methods:

```javascript
initControls: function(synth) {
  var initWaveform = 'input[value="' + synth.oscillator.type + '"]';
  $(initWaveform).attr('checked', 'checked');
  $('.envelope .attack').val(synth.envelope.attack);
  $('.envelope .sustain').val(synth.envelope.sustain);
  $('.envelope .decay').val(synth.envelope.decay);
  $('.envelope .release').val(synth.envelope.release);
  $('.portamento').val(synth.portamento);
  $('.detune').val(synth.detune.value);
  $('.filter .q').val(synth.filter.Q.value);
  $('.filter-envelope .attack').val(synth.filterEnvelope.attack);
  $('.filter-envelope .sustain').val(synth.filterEnvelope.sustain);
  $('.filter-envelope .decay').val(synth.filterEnvelope.decay);
  $('.filter-envelope .release').val(synth.filterEnvelope.release);
}
```

The `App.bindEvents` method invoked in `App.init` also accepts a Tone.js synth
object as an argument, and contains the code that handles the event listeners
when UI elements change:

```javascript
$('.mute').change(function(e) {
  if ( $(this).is(':checked') ) {
    Tone.Destination.mute = true;
  } else {
    Tone.Destination.mute = false;
  }
});
$('.volume').change(function(e) {
  Tone.Destination.volume.value = $(this).val();
});
$('.waveforms input').change(function(e) {
  var waveform = $(this).val();
  synth.oscillator.type = waveform;
});
$('.envelope input').change(function(e) {
  var controlName = this.name;
  var controlValue = $(this).val();
  var currentEnv = synth.envelope;
  currentEnv[controlName] = controlValue;
});
$('.portamento').change(function(e) {
  synth.portamento = $(this).val();
});
$('.detune').change(function(e) {
  synth.detune.value = $(this).val();
});
$('.filter .q').change(function(e) {
  synth.filter.Q.value = $(this).val();
});
$('.filter-envelope input').change(function(e) {
  var controlName = this.name;
  var controlValue = $(this).val();
  var currentEnv = synth.filterEnvelope;
  currentEnv[controlName] = controlValue;
});
```

`App.bindEvents` also utilizes KeyboardJS, a key bindings library that most
importantly allows the `.preventRepeat()` method to disable key repeat when
keys are held down. The names of the home row keys are held in a variable in
the `CONSTANTS` object, and Tone.js triggers are attached to both the key
bindings and the `<label>` elements that hold the `<button>` UI elements.

```javascript
CONSTANTS.HOME_ROW.forEach(function(elem, i) {
  keyboardJS.bind(elem, function(e) {
    e.preventRepeat();
    synth.triggerAttack(App.currentScale[i]);
    $(keybtns).removeClass('active');
    $(keybtns[i]).addClass('active');
  },
  function(event) {
    $(keybtns[i]).removeClass('active');
    synth.triggerRelease();
  });
});
document.querySelectorAll('.keyboard label').forEach(function(elem, i) {
  elem.addEventListener('mousedown', function(e) {
    synth.triggerAttack(App.currentScale[i]);
  });
  elem.addEventListener('mouseup', function(e) {
    synth.triggerRelease();
  });
});
```

Teoria.js is a library that allows for programming in a Western music theory
context. Earlier in development, the `CONSTANTS.DEFAULT_SCALE` array supplied
the app with the notes needed by the `Tone` object to create a full scale.
Teoria.js allows for scales, notes, and intervals to be represented by objects,
and objects can be chained together like in jQuery. The `App.generateScale`
method now returns an array that is used to create the notes, so that in the
future, users could choose the tonic note, octave, and scale type they want the
keyboard to control.

```javascript
generateScale: function(tonic, scaleType) {
  var tonicObj = teoria.note(tonic);
  var scaleObj = tonicObj.scale(scaleType);
  var notesArr = scaleObj.notes();
  var noteNamesArr = [];
  notesArr.forEach(function(e, i) {
    noteNamesArr.push(e.scientific());
  });
  noteNamesArr.push(teoria.interval(tonicObj, 'P8').scientific());
  return noteNamesArr;
}
```

There are many different directions this app could go:

* [x] generate UI via JS
* [ ] add effects and polyphony
* [ ] allow the saving and recall of patches
* [ ] adding a chord arpeggiator or sequencer
* [ ] add Web MIDI API support so the synth could be played with a MIDI keyboard

------

Last updated: 2023-12-23 07:25 UTC
