/**
 * Created by on 2017/10/20.
 */
import BasicComponent from "BasicComponent";
import SceneMap from "SceneMap";

class PlayerMove extends BasicComponent {

    constructor() {
        super();
        this._speed = 5;
        this._isMove = false;
        this._lastLen = null;

    }

    move(dirX, dirY){
        let dir = cc.p(dirX, dirY);
        let v = dir.normalizeSelf();

        let node = this.node;
        let x = node.x;
        let y = node.y;
        let nextX = x + v.x * this._speed;
        let nextY = y + v.y * this._speed;
        node.x = nextX;
        node.y = nextY;

        this._sceneMap.adjust(nextX, nextY);
    }

    setDestination(point) {
        this._isMove = true;
        this._lastLen = null;
        //算出矢量位移，以及矢量速度
        let curX = this.node.x;
        let curY = this.node.y;

        this._s = cc.p(point.x - curX, point.y - curY);
        this._v = this._s.normalizeSelf();
        this._dest = point;

        //模型方向处理
        this.setDir(point.x - curX);
        this.playerAnimation("run");
        //TODO，需要进行边界间隔
    }

    setDir(value){
        let dir = 1;
        if(value < 0){
            dir = -1;
        }
        let model = this.node.getChildByName("model");
        model.scaleX = -dir;
    }

    playerAnimation(name){
        let model = this.node.getChildByName("model");
        let spine = model.getComponent(sp.Skeleton);
        spine.animation = name;
    }

    initComponent(){
        let cameraNode = this.getChildByName("camera");
        this._camera = cameraNode.getComponent(cc.Camera);
        let targetNode = this._camera.getTargets()[0];
        this._sceneMap = targetNode.getComponent(SceneMap);
        this._sceneMap.setCameraNode(cameraNode);

        this._sceneMap.adjust(this.node.x, this.node.y);
    }

    update() {
        if (!this._isMove) {
            return;
        }

        let node = this.node;
        let x = node.x;
        let y = node.y;
        let nextX = x + this._v.x * this._speed;
        let nextY = y + this._v.y * this._speed;

        //TODO 到达目的地的算法，还需要修改。
        let len = (this._dest.x - nextX) * (this._dest.x - nextX)
            + (this._dest.y - nextY) * (this._dest.y - nextY);

        if(this._lastLen != null && len > this._lastLen){
            this._isMove = false;  //达到目的地了
            this._lastLen = null;
            node.x = this._dest.x;
            node.y = this._dest.y;
            this.playerAnimation("wait");
            return;
        }

        this._lastLen = len;
        node.x = nextX;
        node.y = nextY;

        this._sceneMap.adjust(nextX, nextY);


    }
}

export default PlayerMove;