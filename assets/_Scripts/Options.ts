import { _decorator, Button, Component, Slider, UIOpacity, tween, EventTarget, AudioSource } from 'cc';
import { BirdAudio } from './BirdAudio';
import { CustomToggle } from './CustomToggle';
const { ccclass, property } = _decorator;

@ccclass('Options')
export class Options extends Component {
    @property({ type: Slider, visible: true }) private _volumeSlider: Slider = null!;
    @property({ type: Button, visible: true }) private _closeButton: Button;
    @property({ type: CustomToggle, visible: true }) private _soundCheckbox: CustomToggle;
    @property({ type: CustomToggle, visible: true }) private _musicCheckbox: CustomToggle;
    @property({ type: Button, visible: true }) private _okButton: Button;
    @property({ type: BirdAudio, visible: true }) private _birdAudio: BirdAudio;
    @property({ type: UIOpacity, visible: true }) private _opacity: UIOpacity;
    @property({ type: AudioSource, visible: true }) private _bgMusic: AudioSource;

    public onOptionsClosed: EventTarget = new EventTarget();

    protected onEnable(): void {
        this._closeButton.node.on(Button.EventType.CLICK, this.onClose, this);
        this._okButton.node.on(Button.EventType.CLICK, this.onClose, this);
    }

    protected onDisable(): void {
        this._closeButton.node.off(Button.EventType.CLICK, this.onClose, this);
        this._okButton.node.off(Button.EventType.CLICK, this.onClose, this);
    }

    public async show(): Promise<void> {
        this.setOpacity(255);
    }

    public async hide(): Promise<void> {
        this.setOpacity(0);
    }

    protected update(_dt: number): void {
        if (this._soundCheckbox.state) this.setSoundsVoluem(this._volumeSlider.progress);
        else this.setSoundsVoluem(0);

        if (this._musicCheckbox.state) this.setMusicVoluem(this._volumeSlider.progress);
        else this.setMusicVoluem(0);
    }

    private async setOpacity(val: number): Promise<void> {        
        return new Promise(resolve => {
            tween(this._opacity)
            .to(0.3, {opacity: val})
            .call(() => {
                resolve();
            })
            .start();
        });
    }

    private async onClose(): Promise<void> {
        this.onOptionsClosed.emit("on-options-closed");
        await this.hide();
        this.node.active = false;
    }

    private setSoundsVoluem(val: number): void {
        this._birdAudio.setVolume(val);
    }

    private setMusicVoluem(val: number): void {
        this._bgMusic.volume = val * 0.6;
    }
}
