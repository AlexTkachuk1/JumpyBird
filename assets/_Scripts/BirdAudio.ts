import { _decorator, Component, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdAudio')
export class BirdAudio extends Component {
    @property({
        type: [AudioClip],
        tooltip: "Bird Audio",
        visible: true,
    })
    private clips: AudioClip[] = [];
    
    @property({
        type: AudioSource,
        tooltip: "Audio Source",
        visible: true,
    })
    private audioSource: AudioSource = null!;

    public setVolume(val: number): void {
        if (val !== this.audioSource.volume) this.audioSource.volume = val;
    }

    public async playAudio(index: number): Promise<void> {
        let clip: AudioClip = this.clips[index];
        
        this.audioSource.playOneShot(clip);
    }
}
