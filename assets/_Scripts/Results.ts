import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Results')
export class Results extends Component {

    @property({
        type: Label,
        visible: true,
    })
    private _scoreLabel: Label;
    
    @property({
        type: Label,
        visible: true,
    })
    private _higeLabel: Label;
    
    @property({
        type: Label,
        visible: true,
    })
    private _resultEnd: Label;

    private _maxScore: number = 0;
    private _currentScore: number = 0;

    public updateScore(score: number) {
        this._currentScore = score;

        this._scoreLabel.string = this._currentScore.toString();
    }

    public resetScore() {
        this.updateScore(0);
        this.hideResults();
    }

    public increaseScore() {
        this.updateScore(this._currentScore + 1);
    }

    public showResults() {
        this._maxScore = Math.max(this._maxScore, this._currentScore);

        this._higeLabel.string = 'High Score: ' + this._maxScore.toString();

        this._higeLabel.node.active = true;
        this._resultEnd.node.active = true;
    }

    public hideResults() {
        this._higeLabel.node.active = false;
        this._resultEnd.node.active = false;
    }
}


