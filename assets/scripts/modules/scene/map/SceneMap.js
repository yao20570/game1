/**
 * Created by on 2017/10/21.
 */
import BasicComponent from "BasicComponent";
import SceneEntity from "SceneEntity";

class SceneMap extends BasicComponent{

    initComponent(){
        let node = this.node;
        this._mapWidth = node.width;
        this._mapHeight = node.height;

        let winSize = cc.director.getWinSize();
        let x = - this._mapWidth / 2 + winSize.width / 2;
        let y = - this._mapHeight / 2 + winSize.height / 2;
        let width = this._mapWidth - winSize.width;
        let height = this._mapHeight - winSize.height;

        this._viewRect = cc.rect(x, y, width, height);
        this._checkPoint = cc.p(0, 0);
        this._cameraNode = null;

        this.createSceneEntity();
    }

    createSceneEntity(){

        let entityNode = new cc.Node();
        entityNode.x = 0;
        entityNode.y = 0;
        entityNode.parent = this.node;
        entityNode.addComponent(SceneEntity);
        let sceneEntity = entityNode.getComponent(SceneEntity);
        sceneEntity.updateModel(101);

    }

    setCameraNode(camera){
        this._cameraNode = camera;
    }

    //地图校正
    adjust(x, y){
        let isIn = this._isInViewRect(x, y);
        let dx = 0;
        let dy = 0;
        if(isIn){
            this._setPos(0, 0);
        }else {
            let xMax = this._viewRect.xMax;
            let xMin = this._viewRect.xMin;
            let yMax = this._viewRect.yMax;
            let yMin = this._viewRect.yMin;

            if(x > xMax){
                dx = x - xMax;
            }
            if(x < xMin) {
                dx = x - xMin;
            }
            if(y > yMax){
                dy = y - yMax;
            }
            if(y < yMin){
                dy = y - yMin;
            }
            this._setPos(dx, dy);
        }
        // console.info("坐标是否在可视区间内:" , x, y, isIn, dx, dy);
        return isIn;
    }


    _setPos(x, y){
        this._cameraNode.x = -x;
        this._cameraNode.y = -y;
    }

    _isInViewRect(x, y){
        this._checkPoint.x = x;
        this._checkPoint.y = y;
        return this._viewRect.contains(this._checkPoint);
    }


}

export default SceneMap;