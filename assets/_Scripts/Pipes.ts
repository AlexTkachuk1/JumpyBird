import { _decorator, Component, Node, Vec3, EventTarget} from 'cc';
const { ccclass, property } = _decorator;

const randomRang = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

@ccclass('Pipes')
export class Pipes extends Component {
    @property({ type: Node, tooltip: "Top Pipe", visible: true }) private _topPipe: Node;
    @property({ type: Node, tooltip: "Bottom Pipe", visible: true }) private _bottomPipe: Node;

    private _pipeSpeed: number = 200;
    private _isPass: boolean = false;
    private _xDeviationRange: number = 100;
    private _gapDeviationRange: number = 120;
    private _minGap: number = 220;
    private _minY: number = -100;
    private _maxY: number = 400;

    public onPipePass: EventTarget = new EventTarget();

    get currentPosX(): number {
        return this._topPipe.position.x;
    }

    set pipeSpeed(val: number) {
        if (val < 200) return;

        console.log("????", this._pipeSpeed, val);
        
        this._pipeSpeed = val;
    }

    get pipeSpeed(): number {
        return this._pipeSpeed;
    }

    public updatePosition(dt: number): void {
        this._topPipe.position = new Vec3(this._topPipe.position.x - this._pipeSpeed * dt, this._topPipe.position.y, this._topPipe.position.z);
        this._bottomPipe.position = new Vec3(this._bottomPipe.position.x - this._pipeSpeed * dt, this._bottomPipe.position.y, this._bottomPipe.position.z);

        if(!this._isPass && this._topPipe.position.x <= -52) { 
            this._isPass = true;
            this.onPipePass.emit("custom-event");
        }
    }

    public reset(initPos: number): void {
        this.resetPipeX(initPos);
        this.resetPipeY();
        this._isPass = false;
    }

    private resetPipeX(initPos: number): void {
        const x = initPos + randomRang(-this._xDeviationRange, this._xDeviationRange);
                
        this._topPipe.position = new Vec3(x, this._topPipe.position.y, this._topPipe.position.z);
        this._bottomPipe.position = new Vec3(x, this._bottomPipe.position.y, this._bottomPipe.position.z);
    }

    private resetPipeY(): void {
        const gap = this._minGap + randomRang(0, this._gapDeviationRange);
        const y = randomRang(this._minY, this._maxY);

        this._topPipe.position = new Vec3(this._topPipe.position.x, y, this._topPipe.position.z);
        this._bottomPipe.position = new Vec3(this._bottomPipe.position.x, y - gap, this._bottomPipe.position.z);
    }
}
