import {
  _decorator,
  Component,
  Node,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Ground")
export class Ground extends Component {
  @property({
    type: [Node],
    tooltip: "Array of grounds",
    visible: true,
  })
  private _groundsNodes: Node[] = new Array(4);

  private _groundsWidth: number = 305;
  private _gameSpeed: number = 300;

  public getCurrentSpeed(): number {
    return this._gameSpeed;
  };

  protected onLoad(): void {
    this.startUp();
  }

  protected update(dT: number) {
    this._groundsNodes.forEach((node, i) => {
      node.position = new Vec3(node.position.x - this._gameSpeed * dT, node.position.y, node.position.z);

      if (node.position.x < -this._groundsWidth) {
        node.position = new Vec3(this._groundsWidth * 3, node.position.y, node.position.z);
      }
    });
  }

  private startUp() {
    this._groundsNodes.forEach((node, i) => {
      const x: number = 0 + i * this._groundsWidth;
      node.position = new Vec3(x, node.position.y, node.position.z);
    });
  }

  public setSpeed(speed: number) {
    if (speed > 0) this._gameSpeed = speed;
  }
}
