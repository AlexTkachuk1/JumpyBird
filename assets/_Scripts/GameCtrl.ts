import {_decorator, CCInteger, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, game, Button, sys } from "cc";
import { Ground } from "./Ground";
import { Results } from "./Results";
import { Bird } from "./Bird";
import { PipePool } from "./PipePool";
import { BirdAudio } from "./BirdAudio";
import { Menu } from "./Menu";
import { Options } from "./Options";
const { ccclass, property } = _decorator;

@ccclass("GameCtrl")
export class GameCtrl extends Component {
  @property({ type: Ground, tooltip: "Ground", visible: true}) private _ground: Ground;
  @property({ type: Results, tooltip: "Results", visible: true }) private _results: Results;
  @property({ type: Bird, tooltip: "Bird", visible: true }) private _bird: Bird;
  @property({ type: PipePool, tooltip: "PipePool", visible: true }) private _pipePool: PipePool;
  @property({ type: BirdAudio, tooltip: "BirdAudio", visible: true }) private _birdAudio: BirdAudio;
  @property({ type: CCInteger }) public groundSpeed: number = 300;
  @property({ type: CCInteger }) public pipeSpeed: number = 200;
  @property({ type: Menu, visible: true }) private _menu: Menu;
  @property({ type: Options, visible: true }) private _options: Options;
  @property({ type: Button, visible: true }) private _optionsBtn: Button;

  private _difficultyCoefficient: number = 0;
  private _isOver: boolean = false;
  private _isPaused: boolean = false;
  private _isMenuStage: boolean = true;

  protected onEnable(): void {
    this._pipePool.onPipePass.on("pipe-passed", this.increaceScore, this);
    this._menu.onPlayClicked.on("on-play-clicked", this.onPlay, this);
    this._menu.onQuitClicked.on("on-quit-clicked", this.onQuit, this);
    this._menu.onOptionsClicked.on("on-options-clicked", this.onOptions, this);
    this._options.onOptionsClosed.on("on-options-closed", this.onOptionsClose, this);
    this._optionsBtn.node.on(Button.EventType.CLICK, this.optionsClicked, this);
  }

  protected onDisable(): void {
    this._pipePool.onPipePass.off("pipe-passed", this.increaceScore, this);
    this._menu.onPlayClicked.off("on-play-clicked", this.onPlay, this);
    this._menu.onQuitClicked.off("on-quit-clicked", this.onQuit, this);
    this._menu.onOptionsClicked.off("on-options-clicked", this.onOptions, this);
    this._options.onOptionsClosed.off("on-options-closed", this.onOptionsClose, this);
    this._optionsBtn.node.off(Button.EventType.CLICK, this.optionsClicked, this);
  }

  protected onLoad(): void {
    this.node.on(Node.EventType.TOUCH_START, this.onClick, this);

    this._results.resetScore();
    this._isOver = false;
    this._isPaused = true;
  }

  protected update(dt: number): void {
    if (!this._isOver) this.birdStruck();
    if (this._bird.hitSomesing) this.gameOver();

    if (this._ground.getCurrentSpeed() !== this.groundSpeed) {
      this._ground.setSpeed(this.groundSpeed);
    }

    if (!this._isPaused) {
      this._ground.updatePosition(dt);
      this._bird.updatePosition(dt);
      this._pipePool.updatePosition(dt);
    }
  }

  protected onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_START, this.onClick, this);
  }

  private startGame(): void {
    this._results.hideResults();
    this._isPaused = false;
  }

  private gameOver(): void {
    this._bird.hitSomesing = false;
    this._birdAudio.playAudio(3);
    this._results.showResults();
    this._isOver = true;
    this._isPaused = true;
    this.saveHighScore();
  }

  private resetGame(): void {
    this._results.resetScore();
    this._pipePool.resetPool();
    this._isOver = false;
    this.startGame();
  }

  private onClick(): void {
    if (!this._isOver) {
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

  private onBeginContact(_selfCollider: Collider2D, _otherCollider: Collider2D, _contact: IPhysics2DContact | null): void {
    this._bird.hitSomesing = true;
    this._birdAudio.playAudio(2);
  }

  private birdStruck(): void {
    this.contactGroundPipe();
  }

  public increaceScore(): void {
    this._results.increaseScore();
    this._birdAudio.playAudio(1);

    if (Math.floor(this._results.score / 5) > this._difficultyCoefficient) {
      this._difficultyCoefficient = Math.floor(this._results.score / 5);
      this._pipePool.setPipeSpeed(this._pipePool.pipeSpeed + 20);
    }
  }

  private async onPlay(): Promise<void> {
    this._isMenuStage = false;
    await this._menu.hide();
    this._menu.node.active = false;
    this._options.node.active = false;

    this._isPaused = false;
  }

  private onQuit(): void {
    game.end();
  }

  private async onOptions(): Promise<void> {
    this._isPaused = true;
    this._options.node.active = true;
    this._options.show();
    await this._menu.hide();
    this._menu.node.active = false;
  }

  private async onOptionsClose(): Promise<void> {
    if (this._isMenuStage) this.onOptionsCloseMenuStage();
    else this.onOptionsClosePauseStage();
  }

  private async onOptionsCloseMenuStage(): Promise<void> {
    this._isPaused = true;
    this._options.hide();
    this._menu.node.active = true;
    await this._menu.show();
    this._options.node.active = false;
  }

  private async onOptionsClosePauseStage(): Promise<void> {
    await this._options.hide();
    this._options.node.active = false;
    this._isPaused = false;
  }

  private optionsClicked(): void {
    this._isPaused = true;
    this._options.node.active = true;
    this._options.show();
  }

  private saveHighScore(): void {
    const userData = {
      highScore: `${this._results.maxScore}`,
    };

    sys.localStorage.setItem('userData', JSON.stringify(userData));
  }
}
