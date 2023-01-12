# Final Project: Synthesizer

My final project web app will be an electronic musical instrument using the **Web Audio API** for waveform sound synthesis.

## Features

### Musical Keyboard

* The application allows you to play play 8 notes (1 octave) using the QWERTY home row or on-screen buttons:

| Do  | Re  | Mi  | Fa  | Sol | La  | Ti  | Do  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C   | D   | E   | F   | G   | A   | B   | C   |
| a   | s   | d   | f   | j   | k   | l   | ;   |

I'm thinking of using the G and H keys as an additional control, like volume or octave.

### Additional Feature Ideas

#### Chromatic Keyboard

Interface expands to enable playing 2 chromatic octaves:

```text
| q  | w  | e  | r  |  | u  | i  | o  | p  |  
| a  | s  | d  | f  |  | j  | k  | l  | ;  |    
| z  | x  | c  | v  |  | m  | ,  | .  | /  |  

| F  | F♯ | G  | G♯ |  | F  | F♯ | G  | G♯ |
| C♯ | D  | D♯ | E  |  | C♯ | D  | D♯ | E  |
| A  | A♯ | B  | C  |  | A  | A♯ | B  | C  |
```

The Number row could control volume:  

| Volume Level: | 10% | 20% | 30% | 40% | 50% | 60% | 70% | 80% | 90% | 100% |
| ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| **Key**:      | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 0    |

#### Saving patches

The app has controls that initialize the on-screen controls to match the values of the synth parameters. So I could figure out a way for users to save and recall their settings.

#### Backing track

I could also add a feature where you can play along to a pre-recorded drum track or other audio file.

## Goals

* Become more familiar with Web Audio API and Tone.js for sound synthesis and other audio capabilities.
* Create an interface that is responsive and can work from a mobile phone, tablet, or desktop, via both QWERTY keyboard, mouse, or touchscreen.
* Use **CSS Flexible Boxes** and **Sass** where appropriate.
* Extend interactivity to hardware with Gamepad & Web MIDI APIs
* Visualization?

## Web APIs

APIs and Libraries I will definitely use are in **bold**.

Instead of public Web APIs I will utilize at least one of the following browser APIs:

* **Web Audio API**
* SVG
* Canvas
* Offline
* Geolocation
* WebGL

## Libraries

* **jQuery 3.1.1**
* Underscore
* [Keypress](https://dmauro.github.io/Keypress/) or [KeyboardJS](https://github.com/RobertWHurst/KeyboardJS) for keyboard event handling
* Audio & MIDI
  * [**Tone.js**](https://tonejs.github.io/) for sound generation
  * [Teoria.js](https://github.com/saebekassebil/teoria) for
* Visuals:
  * [PixiJS](http://www.pixijs.com/)

## Inspiration

* The drum machine from Class 1!
* [Hebdomad](http://brianginsburg.com/hebdomad) uses home row keys for input
* [Roland SH-201 Guide Book](http://www.rolandce.com/mediafiles/quickstartguides/SH-201_Guide_Book_EN.pdf)
* [The Airhorner](https://airhorner.com/) ([Google Developers interview with Airhorner's creator](https://developers.google.com/web/showcase/2015/airhorner))
* [Noisehack: How to Build a Monotron Synth with the Web Audio API](http://noisehack.com/how-to-build-monotron-synth-web-audio-api/)
* [Transcendental Generative](https://opencontent.org/blog/archives/335) — discusses the twelve tone technique and transcendental numbers
* [Keith McMillian's Making Music in the Browser](https://www.keithmcmillen.com/category/blog/tutorials/making-music-in-the-browser/) tutorials
  * [Web Audio API, Part 1](https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-api-part-1/)
  * [Web Audio/MIDI – VCO/VCA](https://www.keithmcmillen.com/category/blog/tutorials/making-music-in-the-browser/)
  * [Web Audio/MIDI – Envelope Generator](https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-midi-envelope-generator/)
  * [Web Audio/MIDI – Amplitude Modulation](https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-and-midi-api-amplitude-modulation/)
  * [HTML5 Gamepad Tester](http://html5gamepad.com/)

## Public APIs

Though I don't see a use for these on this project, these APIs were on my short list when considering what to do:

* [Deck of Cards](http://deckofcardsapi.com/)
* [Noun Project](http://api.thenounproject.com/)
* [Songsterr](https://www.songsterr.com/a/wa/api)
* [Sunrise Sunset](http://sunrise-sunset.org/api)
