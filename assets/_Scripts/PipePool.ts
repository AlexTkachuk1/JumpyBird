import { _decorator, Component, instantiate, Node, screen, Prefab, EventTarget } from 'cc';
import { Pipes } from './Pipes';
const { ccclass, property } = _decorator;

@ccclass('PipePool')
export class PipePool extends Component {
    @property({
        type: Prefab,
        tooltip: "Pipes Prefab",
        visible: true,
    })
    private _prefabPipes: Prefab;

    private _pool: Node[] = [];
    private _pipeStep: number = 550;
    private _lastPipePosX: number = screen.windowSize.width / 2 + this._pipeStep + 200;

    public onPipePass: EventTarget = new EventTarget();

    get pipeSpeed(): number {
        return this._pool[0].getComponent(Pipes)!.pipeSpeed;
    }

    public setPipeSpeed(val: number) {
        this._pool.forEach(el => {            
            el.getComponent(Pipes)!.pipeSpeed = val;
        });
    }

    protected onLoad(): void {
        this.initPool();

        this._pool.forEach(el => {
            el.getComponent(Pipes)!.onPipePass.on("custom-event", () => {
                this.onPipePass.emit("pipe-passed");
            });
        });
    }

    protected onDestroy(): void {
        this._pool.forEach(el => {
            el.getComponent(Pipes)!.onPipePass.off("custom-event", () => {
                this.onPipePass.emit("pipe-passed");
            });
        });
    }

    public updatePosition(_dt: number): void {
        for (let i = 0; i < this._pool.length; i+=1) {
            const element = this._pool[i];
            const pipe = element.getComponent(Pipes)!;
            
            pipe.updatePosition(_dt);
            if (pipe.currentPosX < -screen.windowSize.width / 2 - 300) {
                pipe.reset(this.getLastPipePosX());
            }
        }
    }

    private initPool(): void {        
        for (let i = 0; i < 3; i+=1) {
            const pipeNode = instantiate(this._prefabPipes);
            this._pool.push(pipeNode);

            const pipe = this._pool[i].getComponent(Pipes)!;
            pipe.reset(this._lastPipePosX);
            this._lastPipePosX = pipe.currentPosX + this._pipeStep;

            this.node.addChild(pipeNode);
        }
    }

    private getLastPipePosX(): number {
        let x = this._pool[0].getComponent(Pipes)!.currentPosX;

        for (let i = 1; i < this._pool.length; i+=1) {
            const elX = this._pool[i].getComponent(Pipes)!.currentPosX;
            if (elX > x) x = elX;
        }
        
        return x + this._pipeStep;
    }

    public resetPool(): void {
        this._lastPipePosX = screen.windowSize.width / 2 + this._pipeStep + 200;

        for (let i = 0; i < this._pool.length; i+=1) {
            const pipe = this._pool[i].getComponent(Pipes)!;
            pipe.reset(this._lastPipePosX);
            this._lastPipePosX = pipe.currentPosX + this._pipeStep;
        }
    }
}
