
'use strict';

import { PlayerError, IPlayerError } from './error';

// Note to self: AudioGraph documentation
// https://developer.mozilla.org/en-US/docs/Web/API/AudioNode

export interface IWaveTable {
}

// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
export interface IAudioContext {

    destination: AudioDestinationNode; // readonly
    sampleRate: number; // readonly
    currentTime: number; // readonly
    listener: AudioListener; // readonly
    activeSourceCount: number; // readonly

    state: string; // readonly

    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;
    createBuffer(buffer: ArrayBuffer, mixToMono: boolean): AudioBuffer;
    // old decodeAudioData
    //decodeAudioData(audioData: ArrayBuffer, decodeSuccessCallback?: Function, decodeErrorCallback?: Function): void;
    // newer decodeAudioData
    decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer>;
    createBufferSource(): AudioBufferSourceNode;
    createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode;
    createMediaStreamSource(mediaStreamMediaStream: MediaStream): MediaStreamAudioSourceNode;
    createMediaStreamDestination(): MediaStreamAudioDestinationNode;
    createScriptProcessor(bufferSize: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): ScriptProcessorNode;
    createAnalyser(): AnalyserNode;
    createGain(): GainNode;
    createDelay(maxDelayTime?: number): DelayNode;
    createBiquadFilter(): BiquadFilterNode;
    createWaveShaper(): WaveShaperNode;
    createPanner(): PannerNode;
    createConvolver(): ConvolverNode;
    createChannelSplitter(numberOfOutputs?: number): ChannelSplitterNode;
    createChannelMerger(numberOfInputs?: number): ChannelMergerNode;
    createDynamicsCompressor(): DynamicsCompressorNode;
    createOscillator(): OscillatorNode;
    createWaveTable(real: Float32Array, imag: Float32Array): IWaveTable;

    onstatechange(): void;
    close(): Promise<void>;
    suspend(): Promise<void>;
    resume(): Promise<void>;
}

declare var webkitAudioContext: {
    prototype: IAudioContext;
    new (): IAudioContext;
};

declare var AudioContext: {
    prototype: IAudioContext;
    new (): IAudioContext;
};

export interface IAudioGraph {
    // https://developer.mozilla.org/en-US/docs/Web/API/GainNode
    gainNode: GainNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/PannerNode
    pannerNode?: PannerNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode
    stereoPannerNode?: StereoPannerNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/DelayNode
    delayNode?: DelayNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode
    scriptProcessorNode?: ScriptProcessorNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
    analyserNode?: AnalyserNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
    biquadFilterNode?: BiquadFilterNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/ChannelMergerNode
    channelMergeNode?: ChannelMergerNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/ChannelSplitterNode
    channelSplitterNode?: ChannelSplitterNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
    convolverNode?: ConvolverNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
    dynamicCompressorNode?: DynamicsCompressorNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
    oscillatorNode?: OscillatorNode;
    // https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
    waveShaperNode?: WaveShaperNode;
}

export interface IAudioOptions {
    volume: number;
    customAudioContext?: IAudioContext;
    customAudioGraph?: IAudioGraph;
}

export interface ISourceNodeOptions {
    loop: boolean;
    onEnded: Function;
}

export class PlayerAudio {

    protected _volume: number;
    protected _audioContext: IAudioContext | null = null;
    protected _contextState: string;
    protected _audioGraph: IAudioGraph | null = null;

    constructor(options?: IAudioOptions) {

        // initial context state is still "closed"
        this._contextState = 'closed';

        this._volume = options.volume;

        if (options.customAudioContext !== undefined) {
            this.setAudioContext(options.customAudioContext);
        }

        if (options.customAudioGraph !== undefined) {
            this.setAudioGraph(options.customAudioGraph);
        } else {
            this._createAudioGraph();
        }

        // TODO: to speed up things would it be better to create a context in the constructor?
        // and suspend the context upon creating it until it gets used?

    }

    public decodeAudio(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {

        return this.getAudioContext().then((audioContext: IAudioContext) => {

            // Note to self:
            // newer decodeAudioData returns promise, older accept as second
            // and third parameter a success and an error callback funtion
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData

            let audioBufferPromise = audioContext.decodeAudioData(arrayBuffer);

            // decodeAudioData returns a promise of type PromiseLike
            // using resolve to return a promise of type Promise
            return Promise.resolve(audioBufferPromise);

        });

    }

    protected _createAudioContext(): IAudioContext {

        let AudioContext = window.AudioContext || (window as any).webkitAudioContext;

        let audioContext = new AudioContext();

        this._bindContextStateListener(audioContext);

        return audioContext;

    }

    protected _bindContextStateListener(audioContext: IAudioContext) {

        audioContext.onstatechange = () => {

            this._contextState = audioContext.state;

            if (this._contextState === 'closed') {
                this._audioContext = null;
            }

        };

    }

    public getAudioContext(): Promise<IAudioContext> {

        return new Promise((resolve, reject) => {

            if (this._contextState === 'closed') {

                let audioContext = this._createAudioContext();

                this._audioContext = audioContext;

                resolve(audioContext);

            } else if (this._contextState === 'suspended') {

                this._unfreezeAudioContext().then(() => {

                    resolve(this._audioContext);

                });

            } else {

                resolve(this._audioContext);

            }

        });

    }

    public setAudioContext(audioContext: IAudioContext): void {

        this._audioContext = audioContext;

        this._bindContextStateListener(audioContext);

    }

    protected _destroyAudioContext() {

        this._destroyAudioGraph();

        this._audioContext.close().then(() => {

            this._audioContext = null;

        });

    }

    protected _unfreezeAudioContext(): Promise<void> {

        // did resume get implemented
        if (typeof this._audioContext.suspend === 'undefined') {

            // this browser does not support resume
            // just send back a promise as resume would do
            return Promise.resolve();

        } else {

            // resume the audio hardware access
            // audio context resume returns a promise
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume
            return this._audioContext.resume();

        }

    }

    protected _freezeAudioContext(): Promise<void> {

        // did suspend get implemented
        if (typeof this._audioContext.suspend === 'undefined') {

            return Promise.resolve();

        } else {

            // halt the audio hardware access temporarily to reduce CPU and battery usage
            return this._audioContext.suspend();

        }

    }

    public setAudioGraph(audioGraph: IAudioGraph) {

        if (this._audioGraph !== null) {
            this._destroyAudioGraph();
        }

        // check if there is gain node
        if (!('gainNode' in audioGraph)
            || audioGraph.gainNode === null
            || audioGraph.gainNode === undefined) {

            this.getAudioContext().then((audioContext: IAudioContext) => {

                audioGraph.gainNode = audioContext.createGain();

                this._audioGraph = audioGraph;

            });

        } else {

            this._audioGraph = audioGraph;

        }

    }

    public getAudioGraph(): Promise<IAudioGraph> {

        return new Promise((resolve, reject) => {

            if (this._audioGraph !== null) {

                resolve(this._audioGraph);

            } else {

                this._createAudioGraph()
                    .then((audioGraph: IAudioGraph) => {

                        this._audioGraph = audioGraph;

                        resolve(audioGraph);

                    }).catch(reject);

            }

        });

    }

    public createSourceNode(sourceNodeOptions: ISourceNodeOptions): Promise<AudioBufferSourceNode> {

        return this.getAudioContext().then((audioContext: IAudioContext) => {

            let sourceNode = audioContext.createBufferSource();

            // do we loop this song
            sourceNode.loop = sourceNodeOptions.loop;

            // if the song ends destroy it's audioGraph as the source can't be reused anyway
            // NOTE: the onended handler won't have any effect if the loop property is set to
            // true, as the audio won't stop playing. To see the effect in this case you'd
            // have to use AudioBufferSourceNode.stop()
            sourceNode.onended = () => {

                sourceNodeOptions.onEnded();

                sourceNode.disconnect();

                sourceNode = null;

            };

            return sourceNode;

        });

    }

    public connectSourceNodeToGraphNodes(sourceNode: AudioBufferSourceNode) {

        sourceNode.connect(this._audioGraph.gainNode);

        if ('analyserNode' in this._audioGraph
            && this._audioGraph.analyserNode !== null
            && this._audioGraph.analyserNode !== undefined) {

            sourceNode.connect(this._audioGraph.analyserNode);

        }

        if ('delayNode' in this._audioGraph
            && this._audioGraph.delayNode !== null
            && this._audioGraph.delayNode !== undefined) {

            sourceNode.connect(this._audioGraph.delayNode);

        }

        // TODO: handle other types of nodes as well
        // do it recursivly!?

    }

    protected _createAudioGraph(): Promise<IAudioGraph> {

        return new Promise((resolve, reject) => {

            this.getAudioContext().then((audioContext: IAudioContext) => {

                if (!this._audioGraph) {

                    this._audioGraph = {
                        gainNode: audioContext.createGain()
                    };

                }

                // connect the gain node to the destination (speakers)
                // https://developer.mozilla.org/en-US/docs/Web/API/AudioDestinationNode
                this._audioGraph.gainNode.connect(audioContext.destination);

                // update volume
                this.changeGainValue(this._volume);

                resolve(this._audioGraph);

            });

        });

    }

    protected _destroyAudioGraph(): void {

        this._audioGraph.gainNode.disconnect();

        this._audioGraph = null;

    }

    public destroySourceNode(sourceNode: AudioBufferSourceNode) {

        sourceNode.disconnect();

        sourceNode = null;

        return sourceNode;

    }

    public changeGainValue(volume: number) {

        this.getAudioGraph().then((audioGraph: IAudioGraph) => {

            audioGraph.gainNode.gain.value = volume / 100;

        });

    }

}
