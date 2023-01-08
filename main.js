import 'normalize.css';
import './style.scss';

import $ from 'jquery';
import * as Tone from 'tone';
import teoria from 'teoria';
import keyboardJS from 'keyboardjs';

$(function(){
  const CONSTANTS = {
    HOME_ROW: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'semicolon'],
    DEFAULT_SCALE: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    MODES: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'],
    NOTE_RANGE: [
      { 'MIN': 'a0' },
      { 'MAX': 'c8' }
    ]
  };
  const App = {
    synthObj: {},
    currentScale: [],
    bindEvents: function(synth) {
      var keybtns = document.querySelectorAll('.keyboard button');
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
      $('.mute').change(function(e) {
        if ($(this).is(':checked')) {
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
    },
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
    },
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
    },
    view: () => {
      const template = `
        <header>
          <h1><strong>Soundsurgeon</strong> JS-11-16 HTML5 Synthesizer</h1>
        </header>
        <div class="device">
          <div class="keyboard">
            <div class="left hand">
              <label><span>Do </span><button>A</button></label>
              <label><span>re </span><button>S</button></label>
              <label><span>mi </span><button>D</button></label>
              <label><span>fa </span><button>F</button></label>
            </div>
            <div class="right hand">
              <label><span>sol</span><button>J</button></label>
              <label><span>la </span><button>K</button></label>
              <label><span>ti </span><button>L</button></label>
              <label><span>do </span><button>;</button></label>
            </div>
          </div>
          <div class="controls">
            <div class="master-vol">
              <label>
                <span>Mute</span>
                <input
                  type="checkbox"
                  class="mute"
                  name="mute">
              </label>
              <label>
                <span>Volume</span>
                <input type="range"
                  class="volume"
                  name="volume"
                  min="-60"
                  max="0"
                  step="-3">
              </label>
            </div>
            <div class="waveforms">
              <label>
                <span>sine</span>
                <input type="radio" name="wave" value="sine">
              </label>
              <label>
                <span>square</span>
                <input type="radio" name="wave" value="square">
              </label>
              <label>
                <span>triangle</span>
                <input type="radio" name="wave" value="triangle">
              </label>
              <label>
                <span>sawtooth</span>
                <input type="radio" name="wave" value="sawtooth">
              </label>
            </div>
            <div class="envelope">
              <h2>Envelope</h2>
              <label>
                Attack
                <input
                  type="range"
                  class="attack"
                  name="attack"
                  min="0"
                  max="5"
                  step="0.1">
              </label>
              <label>
                Decay
                <input
                  type="range"
                  class="decay"
                  name="decay"
                  min="0"
                  max="10"
                  step="0.5">
              </label>
              <label>
                Sustain
                <input
                  type="range"
                  class="sustain"
                  name="sustain"
                  min="0"
                  max="1"
                  step="0.1">
              </label>
              <label>
                Release
                <input
                  type="range"
                  class="release"
                  name="release"
                  min="0.5"
                  max="10"
                  step="0.5">
              </label>
            </div>
            <div>
              <label>
                <span>Portamento</span>
                <input
                  type="range"
                  class="portamento"
                  name="portamento"
                  min="0"
                  max="1"
                  value=""
                  step="0.1">
              </label>
              <label>
                <span>Detune</span>
                <input type="range"
                  class="detune"
                  name="detune"
                  value=""
                  min="0"
                  max="50">
              </label>
            </div>
            <div class="filter">
              <h2>Filter</h2>
              <label>
                <span>Q</span>
                <input
                  type="range"
                  class="q"
                  name="q"
                  min="0"
                  max="10"
                  step="1">
              </label>
              <div class="filter-envelope">
                <label>
                  <span>Attack</span>
                  <input
                    type="range"
                    class="attack"
                    name="attack"
                    min="0"
                    max="5"
                    step="0.1">
                </label>
                <label>
                  <span>Decay</span>
                  <input
                    type="range"
                    class="decay"
                    name="decay"
                    min="0"
                    max="10"
                    step="0.5">
                </label>
                <label>
                  <span>Sustain</span>
                  <input
                    type="range"
                    class="sustain"
                    name="sustain"
                    min="0"
                    max="1"
                    step="0.1">
                </label>
                <label>
                  <span>Release</span>
                  <input
                    type="range"
                    class="release"
                    name="release"
                    min="0.5"
                    max="10"
                    step="0.5">
                </label>
              </div>
            </div>
          </div>
        </div>
      `;
      $('.app').html( () => {
        return template;
      });
    },
    init: function() {
      App.view();
      App.synthObj = new Tone.MonoSynth().toDestination();
      App.currentScale = App.generateScale('c2', CONSTANTS.MODES[0]);
      Tone.Destination.volume.value = -6;
      App.initControls(App.synthObj);
      App.bindEvents(App.synthObj);
    }
  };
  App.init();
});
