[![npm version](https://img.shields.io/npm/v/web-audio-api-player.svg?style=flat)](https://www.npmjs.com/package/web-audio-api-player)
[![minified size](https://img.shields.io/bundlephobia/min/web-audio-api-player?style=flat)](https://www.npmjs.com/package/web-audio-api-player)
[![GitHub license](https://img.shields.io/github/license/chrisweb/web-audio-api-player?style=flat)](https://github.com/chrisweb/web-audio-api-player/blob/master/LICENSE)

# web audio API player

<p align="center"><img width="202" height="225" src="./assets/web_audio_api_player_logo_small.png" alt="web audio API player logo"></p>

## About this project

🎶 An opensource javascript (typescript) audio player for the browser, built using the Web Audio API with support for HTML5 audio elements

this player can be added to any javascript project and extended in many ways, it is not bound to a specific UI, this player is just a core that can be used to create any kind of player you can imagine and even be used to play sound in video games or for any other sound / song playing needs you may have  

Want to help improve the documentation or contribute to this project by improving and fixing it, then first check out the [TODOs section](#todos-ideas-for-future-improvements) below, maybe there is something in the list you want to help with. Any contribution, even things not listed on the TODO list are of course welcome. To get started check out the section ["contributing" section](#contributing-prs-welcome) below.  

## installation

web audio API player is published to the [npm registry](https://npm.im/web-audio-api-player) so you can install it with either [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com)  

with npm:

`npm i web-audio-api-player`  

or with yarn:

`yarn add web-audio-api-player`  

## examples

the best way to get started is to check out the examples folder, check out the source of [simple player example](examples/simple-player) if you want to see how to build a fully working player with UI elements of a basic audio player

## documentation

### player options

Note: if you use typescript, import the **ICoreOptions** interface along with the playerCore, this makes it a lot easier to see what player options are available and what the type of each value is

* volume: [number] (default: 80) the current playback volume
* loopQueue: [boolean] (default: false) after the last song in the queue has finished to play should the player do a loop and continue to play by playing the first song or stop playing
* soundsBaseUrl: [string] (default: '') the base url for the location of the songs
* playingProgressIntervalTime: [number] (default: 200) the interval in milliseconds at which the player should trigger a songs **onPlaying** callback which will tell you the playing progress in percent, this value is a minimum value because the player uses the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) internally, meaning that if the browser is very busy it might take a bit longer than the defined interval time before the progress value is being reported, this helps to prevent that your UI uses resources that are needed more urgently somewhere else
* playNextOnEnded: [boolean] (default: true) when a sound or song finishes playing should the player play the next song that is in the queue or just stop playing
* audioGraph: [IAudioGraph] (default: null) a custom audiograph you inject to replace the default audiograph of the player
* audioContext: [AudioContext] (default: null) a custom audiocontext you inject to replace the default audiocontext of the player
* stopOnReset: [boolean] (default: true) when the queue gets reset and a song is currently being played, should the player stop or continue playing that song
* visibilityAutoMute: [boolean] (default: false) tells the player if a song is playing and the visibility API triggers a visibility change event, if the currently playing song should get muted or not, uses the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) internally
* createAudioContextOnFirstUserInteraction: [boolean] (default: true) for a song to be played the player needs to have an audiocontext, on mobile you can play sounds / songs until the user has interacted in some way with your UI, this means autoplay with no user interaction will not work, when this option is set to true the player will try to catch the very first user interaction and initialize and audiocontext so that when a song needs to be played the context will be available
* persistVolume: [boolean] (default: true) if this value is set to true the player will use the localstorage of the browser and save the value of the volume (localstorage entry key is **WebAudioAPIPlayerVolume**), if the page gets reloaded or the user comes back later the player will check if there is a value in the localstorage and automatically set the player volume to that value
* loadPlayerMode: [typePlayerModes] (default: PLAYER_MODE_AUDIO) this is a constant you can import from player, currently you can chose between two modes, [PLAYER_MODE_AUDIO](#player_mode_audio) which uses the audio element to load sounds via the audio element and [PLAYER_MODE_AJAX](#player_mode_ajax) to load sounds via the web audio API

### sound attributes

Note: if you use typescript, import the **ISoundAttributes** interface along with the playerCore, this makes it a lot easier to see what song attributes are available and what the type of each value is

**sound options:**

* source?: [(ISoundSource)[] | ISoundSource] a single sound source or an array of sound sources, an **ISoundSource** object consists of 3 values:
  * **url** [string] is the base url defined in the player options + the path defined here or you add the full url here, the URL will get used by the player to load the song when needed
  * **codec** [string] the codec that got used to encode the song, this allowed the player to check if that codec is supported by the browser and it also allows the player to decide which source to use if multiple sources have been defined
  * **isPreferred** [boolean] (optional) the player will use the first source that has a codec this is supported by the browser, if more than one codec is supported it will take the source that is marked as **isPreferred**
* id: [number] a unique and numeric id for the song, used as a reference to link content to that sound which is not part of the sound object itself
* loop: [boolean] (optional, default false) if the song playback should loop when it reaches the end of sound
* audioBuffer: [AudioBuffer] (optional) if you want to inject your own custom [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) to be used instead of the default one the player will create
* arrayBuffer: [ArrayBuffer] (optional) if you want to inject your own custom [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) to be used instead of the default one the player will create
* duration: [number] (optional) if you know the duration of the sound and want to tell the player about it early, the player depending on the play mode will need to wait for the song to be fully loaded until it can determine the duration

**sound callbacks:**

* onLoading: [function] (optional) a callback funtion that will get triggered at intervals during the loading process of a sound
* onPlaying: [function] (optional) a callback funtion that will get triggered at intervals while the sound is playing
* onEnded: [function] (optional) a callback funtion that will get triggered when the end of the sound playback is reached
* onStarted: [function] (optional) a callback funtion that will get triggered when the sound playback starts
* onStopped: [function] (optional) a callback funtion that will get triggered when the sound playback is stopped (the difference between pause and stop is that stop will free the resources needed to play a song)
* onPaused: [function] (optional) a callback funtion that will get triggered when the sound playback is being paused (use pause instead of stop if there is a reason to assume that the playback will be resumed at anytime, if this can't be assumed it is recommended to call stop)
* onResumed: [function] (optional) a callback funtion that will get triggered when the sound playback gets resumed after if got set to pause

### guide to building a simple audio player UI

in this chapter I will try to explain how to set up the most important parts of a player, but I also recommend you have a look at the [simple player example](examples/simple-player) which is an HTML / Javascript client and has an express.js server, to demonstrate how to build an UI, you can explore and run the example locally if you want to know more about how to use this package and see a working example

after having [installed](#installation) the package you need to import it, like so:

```ts
import { PlayerCore, ICoreOptions, ISoundAttributes } from 'web-audio-api-player'
```

what you must import is the **PlayerCore**, the other two **ICoreOptions** and **ISoundAttributes** are optional, I import those two because I write my code using typescript and want the player and sound / song options types

first we define some options for our player core:

```ts
const options: ICoreOptions = {
    soundsBaseUrl: '/assets/songs/',
    loopQueue: true,
}
```

Note: the **soundsBaseUrl** is the first option we set, it will tell the player what the full URL for the songs source is (for example <https://www.example.com/songs/>) or if the player and songs are hosted on the same domain the path is enough, **loopQueue** by default is set to false, I enable it here, this means that at the end of a queue (a playlist) the player won't stop but instead go back to the first song and play that song

next we initialize the player using our options object and get a player instance in return:

```ts
const player = new PlayerCore(options)
```

now we are going to create our first song:

```ts
const firstSongAttributes: ISoundAttributes = {
    source: [
        {
            url: 'mp3/song1.mp3',
            codec: 'mp3',
        },
        {
            url: 'ogg/song2.ogg',
            codec: 'ogg',
            isPreferred: true,
        }
    ],
    id: 1,
}
```

the only two attributes that are mandatory are the source array and the sound id, the source only needs one entry but for demonstration purposes I added two here, the first one is the song encoded as an mp3 and the second source is the same song but this time it has is encoded using the ogg codec, a third source option is **isPreferred**, it tells the player that if the browser has support for both codecs but that it should preferrably use ogg over mp3, the id can be any numeric value, it can be usefull if you have additional song data stored somewhere, for example if you have the related band name info, the songs music genre and so on, for example stored in a database and want to display that data in the UI while the song is being played

after we have set the attributes for our first song we pass these attributes to the player queue:

```ts
const firstSong = player.addSoundToQueue({ soundAttributes: firstSongAttributes })
```

if you want to you can add callbacks via the songs attributes, these callbacks will get triggered by the player when an internal event happens to let your code adapt the UI based on them, I'm going to use those callbacks with a console.log inside to demonstrate their use as I add a second song to queue:

```ts
const secondSongAttributes: ISoundAttributes = {
    source: [
        {
            url: 'mp3/song2.mp3',
            codec: 'mp3',
        },
        {
            url: 'ogg/song2.ogg',
            codec: 'ogg',
            isPreferred: true,
        }
    ],
    id: 2,
    onLoading: (loadingProgress, maximumValue, currentValue) => {
        console.log('onLoading (loadingProgress, maximumValue, currentValue): ', loadingProgress, maximumValue, currentValue)
    },
    onPlaying: (playingProgress, maximumValue, currentValue) => {
        console.log('onPlaying (playingProgress, maximumValue, currentValue): ', playingProgress, maximumValue, currentValue)
    },
    onStarted: (playTimeOffset) => {
        console.log('onStarted (playTimeOffset): ', playTimeOffset)
    },
    onPaused: (playTimeOffset) => {
        console.log('onPaused (playTimeOffset): ', playTimeOffset)
    },
    onStopped: (playTimeOffset) => {
        console.log('onStopped (playTimeOffset): ', playTimeOffset)
    },
    onResumed: (playTimeOffset) => {
        console.log('onResumed (playTimeOffset): ', playTimeOffset)
    },
    onEnded: (willPlayNext) => {
        console.log('onEnded (willPlayNext): ', willPlayNext)
    }
}
```

after we have set the attributes for our second song we pass these attributes to the player queue too, which means we now have a queue with two songs:

```ts
const secondSong = player.addSoundToQueue({ soundAttributes: secondSongAttributes })
```

some player options can be changed even after initialization, for example if you want to adjust the volume, you could do this:

```ts
let volume = 90

player.setVolume(volume)
```

or you want to player to be muted when the browser of the user goes into the background then you can still enable the option:

```ts
player.setVisibilityAutoMute(true)
```

or you want the queue to make a loop when the last song in the player queue (your playlist) finishes playing, then you would enable / disable it like this:

```ts
player.setLoopQueue(true)
```

Note: all of these setters have a corresponding getter, so if you want to now what the current value is, for example if you want to know what the current volume is set to:

```ts
const volume = player.getVolume(volume)
```

now it is time to build your player UI, if you want a good example of such an UI check out the [simple player example](examples/simple-player)

first thing we need is an play button (of course you can use any element you want, you just need to attach an onclick to it), in this example we will use an HTML button element:

```html
<button id="playButton" class="button">
    <span id="play-icon">&gt;</span>
</button>
```

and then you listen for the onclick, when the onclick gets triggered you tell the player to start playing (if nothing is defined it will play the first song in the queue by default):

```ts
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', (event) => {
    event.preventDefault();
    player.play()
})
```

here is another example from a react component I use for my blog [chris.lu source on github](https://github.com/chrisweb/chris.lu):

```ts
<button onClick={onClickPlayHandler} className={styles.play}>
    <FontAwesomeIcon icon={faPlay} size="2x" color='white' />
</button>
```

and here is the click handler I have in my react component, which tells the player to play the first song from the queue:

```ts
const onClickPlayHandler = () => {
    player.play()
}
```

### modes extended knowledge

#### PLAYER_MODE_AUDIO

sounds / songs get loaded via a hidden HTML `<audio>` element

this is the default mode

* Support for streaming
* Files get loaded using the audio element, the loading progress is not just a single value, it can be split into multiple parts (time ranges), so for example the start of a song from 0 to 10 percent got loaded, then there is a blank of not yet loaded data and then also the part from 35 to 60 percent has been loaded
* A song can be played as soon as a big enough portion of the sound has been loaded (what "big enough" means, is that the browser calculates how much of the sounds needs to get loaded to be able to start playing it and continue loading (streaming) what is left without having to pause the sound at some time during the play process until the end of the playback)

#### PLAYER_MODE_AJAX

songs / sounds get fetched using an `XMLHttpRequest`, this happens in the [request](src/library/request.ts) file, check it out if you want to know exactly how it works

* No support for streaming
* Files get loaded using XMLHttpRequest, the loading progress is in percent and it is a single value between 0 and 100 percent loaded
* A song has to be fully fetched before it can be turned into a buffer and hence before the playback can start

#### features / differencies clarification

Note: You might have read (like I did) a lot of outdated web audio articles which stated the web audio element lacks a lot of features the web audio API and that hence it is not suited to create complex audio software or for example be used in games where you might want to add effects and filters to sounds. This is not true anymore and especially not true for this library. Yes the audio element if used as a standalone lacks a lot of features. But this library does combine the web audio element with the web audio API.

If you use this library, the difference is only how the sound (song) gets loaded (see list of differences above). If using fetch the source is a Buffer and if using the "HTML audio element" well the source is a media element. Everything that happens after is the same. This is why you can change in the player options the PLAYER_MODE, to either load the sound using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) if you set the mode to **PLAYER_MODE_AJAX** or load / stream it using the [audio element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) by setting the mode to **PLAYER_MODE_AUDIO** (this is the default). But this influences only how the sound get loaded (fetched), if loaded via audio element, we use the web audio API [createMediaElementSource method](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource) of the audiocontext to pass it to the audiocontext of the web audio API. After feeding the web audio API with the input from the web audio element, the playback and what you do with it is being handled by the web audio API.

#### so which PLAYER_MODE should I use

It depends on what you intend to build.

If you build a game where you have a lot (of small sounds) that get (pre-)loaded and maybe cached but played later at some time after they finished loading, use PLAYER_MODE_AJAX. Its progress is easier to understand, because when the loading progress of the sound has reached 100% you know it can be played. To display the loading progress a simple [HTML progress element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) is enough.

If you build a music player, use the PLAYER_MODE_AUDIO as you might to want to start playing the sound (song) as quickly as possible and don't care if it has fully loaded yet as long as the part that has been loaded is enough to play the song until the end (while the rest of it is being streamed from the server in the background). To display the time range(s) that have been loaded you could for example use a [2D canvas element](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

### advanced usage

#### You can create and then inject your own AudioContext

You can inject your own, if you want to reuse an existing one your app already created:

TODO: add example

You can also take the one created by the library and alter it the way you want:

TODO: add example

#### You can create and then inject your own AudioGraph (audio routing graph)

This is especially useful if you want to add your own nodes to the AudioGraph (audio routing graph). For example you may want to add an [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) or a pannerNode, delayNode or any other node that is available in the web audio API.

## read more: W3C sources and MDN documetation

* [W3C Recommendation, 17 June 2021](https://www.w3.org/TR/webaudio/)  
* [Web Audio API: Editor’s Draft, 18 July 2023](https://webaudio.github.io/web-audio-api/)  
* [MDN "Web Audio API" page](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)  
* [MDN "The Embed Audio element" page](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
* Support tables for audio features, [caniuse: web audio API / audio element / formats ...](https://caniuse.com/#search=audio)  

## development: build

install the latest nodejs (if you haven't already) [nodejs](https://nodejs.org)  

install or update to the latest git version [git scm downloads](https://git-scm.com/downloads) (During installation at the step "choosing the default editor used by Git", if like me you are using visual studio code you might want to chose the new option "use visual studio code as Git's default editor") (also if like me you are on windows, at the step "adjusting your PATH environment", ensure the second radio button option is selected "git from the line and also from 3rd-party software" to ensure git is added to the windows PATH, which will allow you to use git with any command line tool like windows powershell for example)  

git clone this repository to get a local copy  

`git clone git@github.com:chrisweb/web-audio-api-player.git`

open your favorite command line tool and go to the root directory of this repository  

update npm to latest version  

`npm install npm@latest -g`

install the dependencies  

`npm i`

to build the distributions  

`npm run build`

in development you can use watch to rebuild every time you edit a typescript file  

## development: watch

`npm run watch`

## development: linting

to lint the typescript files  

`npm run lint`

## notes about problems I encountered during development

### web audio api typings notes

As of the 25.05.2019 the web audio api typings seem to be included in lib.d.ts, so removing them from package.json:  

```json
  "dependencies": {
    "@types/webaudioapi": "0.0.27"
  },
```

Unfortunately (as of 06/2019) the defined window does not have AudioContext:  

* check out [github ticket](https://github.com/microsoft/TypeScript/issues/31686)  
* the current [dom.d.ts on github](https://github.com/microsoft/TypeScript/blob/master/src/lib/dom.generated.d.ts)  

This is fixed, as of now (20.02.2023) the AudioContext is now defined properly

## Changelog

check out the [releases page](https://github.com/chrisweb/web-audio-api-player/releases) on github

## contributing (PRs welcome)

if you wish to contribute to this project, please first open a [ticket in the github issues page of this project](https://github.com/chrisweb/web-audio-api-player/issues) and explain briefly what fix or improvement you want to provide (remember the github ticket number you will need it for the commit message later on), if you want to help but are not sure what would be useful then check out the [todos list](#todos-ideas-for-future-improvements)

go the [github page of this project](https://github.com/chrisweb/web-audio-api-player) and hit the fork button  

follow the instructions in the previous section ["development: build"](#development-build), but instead of cloning this projects repository, clone **your own fork** of the project to get a local copy that you can edit in your IDE (VSCode)  

`git clone https://github.com/YOUR_GITHUB_USER/web-audio-api-player.git`

when you are done coding, commit your local changes (if your commit is related to a ticket start your commit message with the "#TICKER_NUMBER", this will "link" the commit to the ticket)  

`git commit -m "#TICKER_NUMBER commit message"`

now go to the github page of your fork and hit the pull request button  

## TODOs (ideas for future improvements)

things I intend to add some day or if you want to help but are not sure what to do, check out this list and just pick one idea you like or that would you think is most useful

if you are interested in helping out 😊 by working on one of the following TODOs, please start by reading the ["contributing"](#contributing-prs-welcome) chapter above

* create a react example
* create a vue.js example
* create an example using the (browser) fileReader, something like:

```javascript
var fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', function(event) {  
  var reader = new FileReader();
  reader.onload = function(event) {
    playerCore._decodeSound(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);
```

* add improve UI style of the "simple" example(s) (or any new example) and then add a screenshot of it to the readme to show what can be achieved
* completely rewrite the sources system, where you can define multiple variants of a sound but with different codecs, app needs to check which codecs are supported by the device and choose one, use should be able to define which codec is preferred if playback support for multiple codecs is available
* destroy the audiocontext at some point, to release memory?
* feature to use the browser notification system to alert which song is being played
* preload AudioBuffers into indexeddb (first song, next song, current song if loop or previous is triggered ...), let the developer set the amount of preloaded AudioBuffers, remove from "cache" by least used and by date when "cache" is full, maybe do such work using this browser feature [requestidlecallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) (when available)
* cache songs for offline mode? indexeddb is not very big (filesystem?), check if doable because saving a playlist of songs might exhaust the free space (depending on the playlist size)
* some methods return a promise others don't, use promises for all to make it more consistent
* write more documentation
* make a list of all possible errors (set a distinct code for each error), handle all error cases that are still unhandled
* [abort](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort) the loading of the sound if the user clicks play and then pause (or stop / next / previous) before the end of the buffering process
* add new mode similar to XMLHttpRequest but that uses [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to get the sound / song data from server
* add feature to crossfade two songs "on end" (if there is a the next song in a playlist) or just fade out (current song) / fade in (next song)
* currently the "find song in queue" can't retrieve songs by queue index, is this useful anyway?
* use suspend and resume if for some time no sound was played? ... to free device resources. As suspend returns a promise, does this mean suspending and resuming takes time? if so how much time does it take, based on that information we can decide after how much time it makes sense to suspend the ctx to save device resources
* use web workers, especially for the decoding of the ArrayBuffer into an AudioBuffer, to not block the main thread while decoding?
* add a shuffle songs mode
* add a loop song (<https://webaudio.github.io/web-audio-api/#looping-AudioBufferSourceNode>) feature (actually maybe this already works today, need to verify)
* add support for more codecs? Note: the player should check which codecs are supported by the browser and compare that list with the ones defined in the sound sources, then the player should use the first codec that is supported and that is marked as "isPreferred", if none is marked as "isPreferred" use the first sources codec that is supported
* write code tests!!! (goal ofc 100% coverage), add [tests coverage badge](https://coveralls.io)
* add saucelabs (or similar) browser testing (and their badge [browser compatibility table badge](https://saucelabs.com/blog/new-open-sauce-ui-and-refreshed-build-status-badges) in readme) to add a test suite for all player features
* add [travis](https://travis-ci.org) continuous integration and badge
* add live demo (via github pages?) for people to see how the player works
* for position and volume, allow to use a percentage or a value
* feature that let's the dev set a volume (via a modifier value / coefficient) per song, useful if some songs are louder than others and you want to normalize the volume of all songs in a playlist to be similar
* add hooks to the sound object for all the native source node events [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode)
* add (stereo) panning

## note to self: publish package on npmjs.com

login to npmjs.com  

`npm login`

to make a publishing test (without actually publishing) use:

`npm publish --dry-run`

!!! before using the next the command ensure the version of your package in the package.json has been updated  

publish a new version on npmjs  

`npm publish`

## License

[MIT](LICENSE)
