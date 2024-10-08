import { ISound, ISoundAttributes, ISoundSource, typeSoundStates } from './sound';
import { PlayerAudio, IAudioOptions } from './audio';
import { PlayerError } from './error';
declare const PLAYER_MODE_AUDIO = "player_mode_audio";
declare const PLAYER_MODE_AJAX = "player_mode_ajax";
declare const PLAYER_MODE_FETCH = "player_mode_fetch";
declare const WHERE_IN_QUEUE_AT_START = "prepend";
declare const WHERE_IN_QUEUE_AT_END = "append";
type typePlayerMode = typeof PLAYER_MODE_AUDIO | typeof PLAYER_MODE_AJAX | typeof PLAYER_MODE_FETCH;
type typeWhereInQueue = typeof WHERE_IN_QUEUE_AT_START | typeof WHERE_IN_QUEUE_AT_END;
export interface ICoreOptions {
    volume?: number;
    loopQueue?: boolean;
    loopSong?: boolean;
    soundsBaseUrl?: string;
    playingProgressIntervalTime?: number;
    playNextOnEnded?: boolean;
    stopOnReset?: boolean;
    visibilityAutoMute?: boolean;
    createAudioContextOnFirstUserInteraction?: boolean;
    persistVolume?: boolean;
    loadPlayerMode?: typePlayerMode;
    audioContext?: AudioContext;
    preload?: boolean;
}
export interface ISoundsQueueOptions {
    soundAttributes: ISoundAttributes;
    whereInQueue?: typeWhereInQueue;
}
interface IDecodeSoundOptions {
    sound: ISound;
}
export interface IPlayOptions {
    whichSound?: number | string | undefined;
    playTimeOffset?: number;
}
interface IFindSoundById {
    soundId: string | number;
}
interface IFindBestSourceResponse {
    url: string;
    codec?: string;
}
interface IGetSoundFromQueue {
    whichSound?: string | number;
    updateIndex?: boolean;
}
export declare class PlayerCore {
    protected _queue: ISound[];
    protected _currentIndex: number;
    protected _playerAudio: PlayerAudio;
    protected _playingProgressRequestId: number;
    protected _playingProgressPreviousTimestamp: DOMHighResTimeStamp;
    protected _postMuteVolume: number;
    protected _options: ICoreOptions;
    static readonly WHERE_IN_QUEUE_AT_END = "append";
    static readonly WHERE_IN_QUEUE_AT_START = "prepend";
    static readonly PLAY_SOUND_NEXT = "next";
    static readonly PLAY_SOUND_PREVIOUS = "previous";
    static readonly PLAY_SOUND_FIRST = "first";
    static readonly PLAY_SOUND_LAST = "last";
    static readonly CURRENT_SOUND = "current";
    static readonly PLAYER_MODE_AUDIO = "player_mode_audio";
    static readonly PLAYER_MODE_AJAX = "player_mode_ajax";
    static readonly PLAYER_MODE_FETCH = "player_mode_fetch";
    constructor(playerOptions?: ICoreOptions);
    protected _initialize(): void;
    protected _audioOptions(): IAudioOptions;
    addSoundToQueue({ soundAttributes, whereInQueue }: ISoundsQueueOptions): ISound;
    _appendSoundToQueue(sound: ISound): void;
    _prependSoundToQueue(sound: ISound): void;
    resetQueue(): void;
    reset(): void;
    getQueue(): ISound[];
    setVolume(volume: number): void;
    getVolume(): number;
    setLoopQueue(loppQueue: boolean): void;
    getLoopQueue(): boolean;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setPosition(soundPositionInPercent: number): void;
    setPositionInSeconds(soundPositionInSeconds: number, id?: number | string): void;
    protected _loadSound(sound: ISound): Promise<ISound | PlayerError>;
    protected _loadSoundUsingAudioElement(sound: ISound): Promise<ISound | PlayerError>;
    protected _loadSoundUsingRequest(sound: ISound): Promise<ISound | PlayerError>;
    protected _initializeAudioElementListeners(sound: ISound): void;
    protected _decodeSound({ sound }: IDecodeSoundOptions): Promise<ISound>;
    protected _cloneAudioBuffer(fromAudioBuffer: AudioBuffer): AudioBuffer;
    play({ whichSound, playTimeOffset }?: IPlayOptions): Promise<void>;
    protected _play(sound: ISound): Promise<void>;
    protected _playAudioBuffer(sound: ISound): Promise<void>;
    protected _playMediaElementAudio(sound: ISound): Promise<void>;
    protected _triggerSoundCallbacks(sound: ISound): ISound;
    protected _progressTrigger: (sound: ISound, timestamp: DOMHighResTimeStamp) => void;
    protected _onEnded(): void;
    protected _getSoundFromQueue({ whichSound, updateIndex }?: IGetSoundFromQueue): ISound;
    protected _findSoundById({ soundId }: IFindSoundById): [ISound, number];
    protected _findBestSource(soundSource: (ISoundSource)[] | ISoundSource): IFindBestSourceResponse;
    protected _checkCodecSupport(codec: string): boolean;
    protected _checkMimeTypesSupport(mediaMimeTypes: string[]): boolean;
    pause(): void;
    stop(): void;
    protected _stop(sound: ISound, soundState: typeSoundStates): void;
    next(): void;
    previous(): void;
    first(): void;
    last(): void;
    protected _playingProgress(sound: ISound): void;
    setVisibilityAutoMute(visibilityAutoMute: boolean): void;
    getVisibilityAutoMute(): boolean;
    protected _handleVisibilityChange(): void;
    disconnect(): Promise<void>;
    getAudioContext(): Promise<AudioContext>;
}
export {};
