import {
  _decorator,
  CCInteger,
  Component,
  director,
  EventKeyboard,
  Input,
  input,
  KeyCode,
  Node,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from "cc";
import { Ground } from "./Ground";
import { Results } from "./Results";
import { Bird } from "./Bird";
import { PipePool } from "./PipePool";
import { BirdAudio } from "./BirdAudio";
const { ccclass, property } = _decorator;

@ccclass("GameCtrl")
export class GameCtrl extends Component {
  @property({
    type: Ground,
    tooltip: "Ground",
    visible: true,
  })
  private _ground: Ground;

  @property({
    type: Results,
    tooltip: "Results",
    visible: true,
  })
  private _results: Results;

  @property({
    type: Bird,
    tooltip: "Bird",
    visible: true,
  })
  private _bird: Bird;

  @property({
    type: PipePool,
    tooltip: "PipePool",
    visible: true,
  })
  private _pipePool: PipePool;

  @property({
    type: BirdAudio,
    tooltip: "BirdAudio",
    visible: true,
  })
  private _birdAudio: BirdAudio;

  @property({
    type: CCInteger,
  })
  public groundSpeed: number = 300;

  @property({
    type: CCInteger,
  })
  public pipeSpeed: number = 200;

  private isOver: boolean = false;

  protected onLoad(): void {
    this.initListener();

    this._results.resetScore();
    this._pipePool.initPool();

    this.isOver = true;
    director.pause();
  }

  protected update(dt: number): void {
    if (!this.isOver) {
      this.birdStruck();
    }

    if (this._ground.getCurrentSpeed() !== this.groundSpeed) {
      this._ground.setSpeed(this.groundSpeed);
    }
  }

  private initListener(): void {
    this.node.on(Node.EventType.TOUCH_START, this.onClick, this);
  }

  private startGame(): void {
    this._results.hideResults();
    director.resume();
  }

  private gameOver(): void {
    this._results.showResults();
    this.isOver = true;
    this._birdAudio.playAudio(3);
    director.pause();
  }

  private resetGame(): void {
    this._results.resetScore();
    this._pipePool.resetPool();
    this.isOver = false;
    this.startGame();
  }

  private onClick(): void {
    if (!this.isOver) {
      this._bird.fly();
      this._birdAudio.playAudio(0);
    } else {
      this.resetGame();
      this._bird.resetBird();
      this.startGame();
    }
  }

  private contactGroundPipe(): void {
    let collider = this._bird.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }
  }

  private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
    this._bird.hitSomesing = true;
    this._birdAudio.playAudio(2);
  }

  private birdStruck(): void {
    this.contactGroundPipe();

    if (this._bird.hitSomesing) {
      this.gameOver();
    }
  }

  public increaceScore(): void {
    this._results.increaseScore();
    this._birdAudio.playAudio(1);
  }

  public createPipe(): void {
    this._pipePool.addPool();
  }
}
