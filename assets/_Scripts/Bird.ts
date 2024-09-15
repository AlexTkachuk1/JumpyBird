import { _decorator, Component, Vec3, lerp, Animation } from 'cc';
const { ccclass, requireComponent } = _decorator;

@ccclass('Bird')
@requireComponent(Animation)
export class Bird extends Component {
    private jumpStrength: number = 35;
    private gravity: number = 2;
    private birdVelocityY: number = 0;
    private fallAcceleration: number = 15;
    private jumpAcceleration: number = 25;
    private animation: Animation;

    public hitSomesing: boolean = false;
    
    protected onLoad(): void {
        this.animation = this.getComponent(Animation);
    }

    public updatePosition(dt: number): void {
        if (-380 > this.node.position.y || 470 < this.node.position.y) this.hitSomesing = true;
        
        let y: number;
        if (this.birdVelocityY > 0) {
            y = lerp(0, this.birdVelocityY, this.jumpAcceleration) * dt; 
        } else {
            y = lerp(0, this.birdVelocityY, this.fallAcceleration) * dt;        
        }
        
        this.node.angle = y * 4;

        this.node.position = new Vec3(this.node.position.x, this.node.position.y + y, this.node.position.z);
        this.birdVelocityY -= this.gravity;
    }

    public resetBird(): void {
        this.node.setPosition(new Vec3(0, 0, 0));
        this.birdVelocityY = 0;
        this.hitSomesing = false;
    }

    public fly(): void {
        this.birdVelocityY = this.jumpStrength;
        this.animation.stop();
        this.animation.play();
    }
}
