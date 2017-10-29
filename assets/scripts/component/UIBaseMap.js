/**
 * Created by on 2017/10/17.
 */

import BasicComponent from "BasicComponent";
import logger from "Logger";

const {ccclass, property} = cc._decorator;
@ccclass
class UIBaseMap extends BasicComponent{

    constructor(){
        super();
        logger.info("UIBaseMap初始化");

        this._touchState = 0; //-1 == 开始/拖动；0结束， GameConfig.lastTouchTime
    }


    //添加点击事件
    registerEvents(){  //注册事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            logger.info("TOUCH_START")
            this._touchState = -1;
            this.onTouchBegan(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            logger.info("TOUCH_MOVE")
            this._touchState = -1;
            this.onTouchMoved(event)
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            logger.info("TOUCH_END")
            this._touchState = -0;
            this.onTouchEnd(event);
        }, this);

    }

    //点击开始
    onTouchBegan(event){



        this._isSceneRunAction = false;
        this._scene.node.stopAllActions()
        this._isSysWorldData = null;

        this._curMove_x = event.getLocation().x
        this._curMove_y = event.getLocation().y
        this._beginMove_x = this._curMove_x
        this._beginMove_y = this._curMove_y

        this._isTouchMoved = false
        this._isBenganMove = true

        let pos = event.getLocation()
        this._touchBeginTime = new Date();

        this._touchBeginPos = pos

        return true;
    }
    //拖动中
    onTouchMoved(event){

        this.onSceneMove(event.getDelta())

        this._isTouchMoved = true;
    }



    onSceneMove(delta){
        let posX = this._scene.node.getPositionX()
        let posY = this._scene.node.getPositionY()
        this.setScenePosition(cc.p(posX + delta.x, posY + delta.y))
    }
//
    setScenePosition(pos){
        let new_pos = cc.p(Math.min(0,pos.x), pos.y)
        this._scene.node.setPosition(new_pos)
    }

    //点击结束
    onTouchEnd(event){



    }

    ////////////////////////////////////////////////////
    getParent() {
        return this.getParent();
    }

}

export default UIBaseMap;