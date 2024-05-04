import { _decorator, Component, Node, Vec3, screen, find, UITransform } from 'cc';
import { GameCtrl } from './GameCtrl';
const { ccclass, property } = _decorator;

const random = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

@ccclass('Pipes')
export class Pipes extends Component {
    @property({
        type: Node,
        tooltip: "Top Pipe",
        visible: true,
    })
    private _topPipe: Node;

    @property({
        type: Node,
        tooltip: "Bottom Pipe",
        visible: true,
    })
    private _bottomPipe: Node;

    private _tempStartPositionUp: Vec3 = new Vec3(0, 0, 0);
    private _tempStartPositionDown: Vec3 = new Vec3(0, 0, 0);
    private _scene = screen.windowSize
    private _game: GameCtrl;
    private _pipeSpeed: number = 200;
    private _tempSpeed: number;
    private isPass: boolean = false;

    protected onLoad(): void {
        this._game = find('GameCtrl').getComponent(GameCtrl);
        this._pipeSpeed = this._game.pipeSpeed;

        this.initPositions();
    }

    protected update(dt: number): void {
        this._tempSpeed = this._pipeSpeed * dt;

        this._tempStartPositionUp = this._topPipe.position;
        this._tempStartPositionDown = this._bottomPipe.position;

        this._tempStartPositionUp.x -= this._tempSpeed;
        this._tempStartPositionDown.x -= this._tempSpeed;

        this._topPipe.setPosition(this._tempStartPositionUp);
        this._bottomPipe.setPosition(this._tempStartPositionDown);

        if(!this.isPass && this._topPipe.position.x <= 0) { 
            this.isPass = true;
            this._game.increaceScore();
        }

        if (this._topPipe.position.x <= -this._scene.width / 2 - 200) {
            this._game.createPipe();
            this.updetePipe();
        }
    }

    private updetePipe(): void {
        this.updetePipeX();
        this.updetePipeY();
        this.isPass = false;
    }

    private updetePipeX(): void {
        this._tempStartPositionUp.x += this._scene.width + 200;
        this._tempStartPositionDown.x += this._scene.width + 200;
    }

    private updetePipeY(): void {
        const gap = random(90, 100);
        const topHeight = random(0, 450);

        this._tempStartPositionUp.y = topHeight;
        this._tempStartPositionDown.y = topHeight - (gap * 10);

        this._topPipe.setPosition(this._tempStartPositionUp);
        this._bottomPipe.setPosition(this._tempStartPositionDown);
    }

    private initPositions(): void {
        this._tempStartPositionUp.x = this._topPipe.getComponent(UITransform).width + this._scene.width;
        this._tempStartPositionDown.x = this._bottomPipe.getComponent(UITransform).width + this._scene.width;

        this.updetePipeY();
    }
}
