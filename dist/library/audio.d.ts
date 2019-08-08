interface IAudioGraph {
    gainNode: GainNode;
    pannerNode?: PannerNode;
    stereoPannerNode?: StereoPannerNode;
    delayNode?: DelayNode;
    scriptProcessorNode?: ScriptProcessorNode;
    analyserNode?: AnalyserNode;
    biquadFilterNode?: BiquadFilterNode;
    channelMergeNode?: ChannelMergerNode;
    channelSplitterNode?: ChannelSplitterNode;
    convolverNode?: ConvolverNode;
    dynamicCompressorNode?: DynamicsCompressorNode;
    oscillatorNode?: OscillatorNode;
    waveShaperNode?: WaveShaperNode;
}
interface IAudioOptions {
    customAudioContext: AudioContext;
    customAudioGraph: IAudioGraph;
    createAudioContextOnFirstUserInteraction: boolean;
    persistVolume: boolean;
}
interface ISourceNodeOptions {
    loop: boolean;
    onEnded: Function;
}
declare class PlayerAudio {
    protected _volume: number;
    protected _audioContext: AudioContext | null;
    protected _audioGraph: IAudioGraph | null;
    protected _createAudioContextOnFirstUserInteraction: boolean;
    protected _persistVolume: boolean;
    constructor(options: IAudioOptions);
    decodeAudio(arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;
    protected _createAudioContext(): Promise<void>;
    protected _autoCreateAudioContextRemoveListener(): void;
    protected _autoCreateAudioContextOnFirstUserInteraction(): void;
    getAudioContext(): Promise<AudioContext>;
    setAudioContext(audioContext: AudioContext): void;
    protected _setAudioContext(audioContext: AudioContext): void;
    protected _destroyAudioContext(): Promise<void>;
    _unfreezeAudioContext(): Promise<void>;
    _freezeAudioContext(): Promise<void>;
    setAudioGraph(audioGraph: IAudioGraph): void;
    getAudioGraph(): Promise<IAudioGraph>;
    protected _createAudioGraph(): Promise<IAudioGraph>;
    protected _destroyAudioGraph(): void;
    createSourceNode(sourceNodeOptions: ISourceNodeOptions): Promise<AudioBufferSourceNode>;
    connectSourceNodeToGraphNodes(sourceNode: AudioBufferSourceNode): void;
    destroySourceNode(sourceNode: AudioBufferSourceNode): AudioBufferSourceNode;
    changeVolume(volume: number, forceUpdateUserVolume?: boolean): number;
    protected _changeGainValue(gainValue: number): void;
    setAutoCreateContextOnFirstTouch(autoCreate: boolean): void;
    getAutoCreateContextOnFirstTouch(): boolean;
    setPersistVolume(persistVolume: boolean): void;
    getPersistVolume(): boolean;
}
export { PlayerAudio, IAudioGraph, IAudioOptions };
