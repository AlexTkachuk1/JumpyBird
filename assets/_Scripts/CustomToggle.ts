import { _decorator, Component, Node, Button, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomToggle')
export class CustomToggle extends Component {
    @property({ type: UIOpacity, visible: true }) private _onActiveOpacity: UIOpacity;
    @property({ type: UIOpacity, visible: true }) private _onInactiveOpacity: UIOpacity;
    @property({ type: UIOpacity, visible: true }) private _offActiveOpacity: UIOpacity;
    @property({ type: UIOpacity, visible: true }) private _offInactiveOpacity: UIOpacity;
    
    @property({ type: Node, visible: true }) private _on: Node;
    @property({ type: Node, visible: true }) private _off: Node;

    private _isActive: boolean = true;
    private _toggleDuration: number = 0.2; 

    get state(): boolean {
        return this._isActive;
    }

    protected onEnable(): void {
        this._on.on(Button.EventType.CLICK, () => {
            this.toggleOn(true);
        });

        this._off.on(Button.EventType.CLICK, () => {
            this.toggleOn(false);
        });
    }

    protected onDisable(): void {
        this._on.off(Button.EventType.CLICK, () => {
            this.toggleOn(false);
        });

        this._off.off(Button.EventType.CLICK, () => {
            this.toggleOn(true);
        });
    }

    private toggleOn(val: boolean): void {
        if (this._isActive !== val) {
            this._isActive = val;

            val ? this.show(this._onActiveOpacity) : this.hide(this._onActiveOpacity);
            val ? this.hide(this._onInactiveOpacity) : this.show(this._onInactiveOpacity);
            val ? this.hide(this._offActiveOpacity) : this.show(this._offActiveOpacity);
            val ? this.show(this._offInactiveOpacity) : this.hide(this._offInactiveOpacity);
        }
    }

    public async show(target: UIOpacity): Promise<void> {
        this.setOpacity(255, target);
    }

    public async hide(target: UIOpacity): Promise<void> {
        this.setOpacity(0, target);
    }

    private async setOpacity(val: number, target: UIOpacity): Promise<void> {        
        return new Promise(resolve => {
            tween(target)
                .to(this._toggleDuration, {opacity: val})
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
}
