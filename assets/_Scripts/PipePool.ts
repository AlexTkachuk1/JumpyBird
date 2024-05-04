import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PipePool')
export class PipePool extends Component {
    @property({
        type: Prefab,
        tooltip: "Pipes Prefab",
        visible: true,
    })
    private _prefabPipes: Prefab;
    
    @property({
        type: Node,
        tooltip: "",
        visible: true,
    })
    private _pipesPool: Node;
    private _pool = new NodePool;
    private _createPipe: Node;
    private currentCount: number = 0;

    public initPool(): void {
        let initCount: number = 2;
        
        for (let i = 0; i < initCount; i++) {
            this._createPipe = instantiate(this._prefabPipes);

            if (i === 0) {
                this.currentCount += 1;
                this._pipesPool.addChild(this._createPipe);
            } else{
                this._pool.put(this._createPipe)
            }
        }
    }

    public addPool(): void {
        if (this._pool.size() > 0){
            this._createPipe = this._pool.get();
        } else{
            this._createPipe = instantiate(this._prefabPipes);
        }

        if (this.currentCount < 2) {
            this.currentCount += 1;
            this._pipesPool.addChild(this._createPipe);
        }
    }

    public resetPool(): void {
        this._pipesPool.removeAllChildren();
        this._pool.clear();
        this.initPool();
    }
}
