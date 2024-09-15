import { _decorator, Component, Button, UIOpacity, tween, EventTarget } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Menu')
@requireComponent(UIOpacity)
export class Menu extends Component {
    @property({ type: Button, visible: true }) private _play: Button;
    @property({ type: Button, visible: true }) private _quit: Button;
    @property({ type: Button, visible: true }) private _options: Button;

    private _opacity: UIOpacity;
    public onPlayClicked: EventTarget = new EventTarget();
    public onQuitClicked: EventTarget = new EventTarget();
    public onOptionsClicked: EventTarget = new EventTarget();

    protected onLoad(): void {
        this._opacity = this.node.getComponent(UIOpacity);
    }

    protected onEnable(): void {
        this._play.node.on(Button.EventType.CLICK, this.onPlay, this);
        this._quit.node.on(Button.EventType.CLICK, this.onQuit, this);
        this._options.node.on(Button.EventType.CLICK, this.onOptions, this);
    }

    protected onDisable(): void {
        this._play.node.off(Button.EventType.CLICK, this.onPlay, this);
        this._quit.node.off(Button.EventType.CLICK, this.onQuit, this);
        this._options.node.off(Button.EventType.CLICK, this.onOptions, this);
    }

    private onPlay(): void {
        this.onPlayClicked.emit("on-play-clicked");
    }

    private onQuit(): void {
        this.onQuitClicked.emit("on-quit-clicked");
    }

    private onOptions(): void {
        this.onOptionsClicked.emit("on-options-clicked");
    }

    public async hide(): Promise<void> {
        return this.setOpacity(0);
    }

    public async show(): Promise<void> {
        this._play.interactable = false;
        this._play.interactable = true;
        this._quit.interactable = false;
        this._quit.interactable = true;
        this._options.interactable = false;
        this._options.interactable = true;

        return this.setOpacity(255);
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
}
