import { _decorator, CCFloat, Component, Vec3, Animation, tween, Node, easing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property({
        type: CCFloat,
        tooltip: "How highe bird can be",
        visible: true,
    })
    private jumpHeight: number = 170;
    
    @property({
        type: CCFloat,
        tooltip: "How long bird can fly",
        visible: true,
    })
    private jumpDuration: number = 0.3;

    private birdAnimation: Animation;
    private birdPosition: Vec3;

    public hitSomesing: boolean = false;
    
    protected onLoad(): void {
        this.resetBird();

        this.birdAnimation = this.getComponent(Animation);
    }

    public resetBird(): void {
        this.birdPosition = new Vec3(0, 0, 0);

        this.node.setPosition(this.birdPosition);

        this.hitSomesing = false;
    }

    public fly(): void {
        this.birdAnimation.stop();

        const newPos = new Vec3(this.node.position.x, this.node.position.y + this.jumpHeight, 0);

        tween(this.node.position)
            .to(this.jumpDuration, newPos, {easing: "smooth", onUpdate: (target: Vec3, ratio: number) => {
                this.node.position = target;
            }
        }).start();

        this.birdAnimation.play();
    }
}
