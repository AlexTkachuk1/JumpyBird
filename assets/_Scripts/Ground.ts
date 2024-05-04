import {
  _decorator,
  Canvas,
  Component,
  director,
  Node,
  Scene,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

import { GameCtrl } from "./GameCtrl";

@ccclass("Ground")
export class Ground extends Component {
  @property({
    type: [Node],
    tooltip: "Array of grounds",
    visible: true,
  })
  private _groundsNodes: Node[] = new Array(3);

  private _groundsWidth: number[] = new Array(3);
  private _tempStartLocations: Vec3[] = new Array(3);

  private _scene: Scene;
  private _canvas: Canvas;
  private _canvasWidth: number;
  private _gameSpeed: number = 300;

  public getCurrentSpeed(): number {
    return this._gameSpeed;
  };

  protected onLoad(): void {
    this._scene = director.getScene();
    this._canvas = this._scene.getComponentInChildren(Canvas);
    this._canvasWidth = this._canvas.getComponent(UITransform).width;

    for (let i = 0; i < this._tempStartLocations.length; i++) {
      this._tempStartLocations[i] = new Vec3();
    }

    this.startUp();
  }

  protected update(deltaTime: number) {
    for (let i = 0; i < this._tempStartLocations.length; i++) {
      this._tempStartLocations[i] = this._groundsNodes[i].position;

      this._tempStartLocations[i].x -= this._gameSpeed * deltaTime;

      if (this._tempStartLocations[i].x <= -this._groundsWidth[i]) {
        this._tempStartLocations[i].x = this._canvasWidth;
      }

      this._groundsNodes[i].setPosition(this._tempStartLocations[i]);
    }
  }

  private startUp() {
    for (let i = 0; i < this._groundsWidth.length; i++) {
      this._groundsWidth[i] =
        this._groundsNodes[i].getComponent(UITransform).width - 15;
    }

    this._tempStartLocations[0].x = 0;
    this._tempStartLocations[1].x = this._groundsWidth[0];
    this._tempStartLocations[2].x = this._groundsWidth[0] + this._groundsWidth[1];

    for (let i = 0; i < this._groundsNodes.length; i++) {
      this._groundsNodes[i].setPosition(this._tempStartLocations[i]);
    }
  }

  public setSpeed(speed: number) {
    if (speed > 0) {
      this._gameSpeed = speed;
    } else {
      this._gameSpeed = 100;
    }
  }
}
