$(document).ready(function(){
  const CONSTANTS = {
    HOME_ROW: [ 'a', 's', 'd', 'f', 'j', 'k', 'l', 'semicolon' ],
    DEFAULT_SCALE: [ 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5' ],
    MODES: [ 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian' ],
    NOTE_RANGE: [
      {'MIN': 'a0'},
      {'MAX': 'c8'}
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
        if ( $(this).is(':checked') ) {
          Tone.Master.mute = true;
        } else {
          Tone.Master.mute = false;
        }
      });
      $('.volume').change(function(e) {
        Tone.Master.volume.value = $(this).val();
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
    init: function() {
      App.synthObj = new Tone.MonoSynth().toMaster();
      App.currentScale = App.generateScale('c2', CONSTANTS.MODES[0]);
      Tone.Master.volume.value = -6;
      App.initControls(App.synthObj);
      App.bindEvents(App.synthObj);
    }
  };
  App.init();
});
