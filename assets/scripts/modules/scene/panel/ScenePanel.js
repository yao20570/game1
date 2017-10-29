/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import PlayerMove from  "PlayerMove";
import SceneMap from "SceneMap";

class ScenePanel extends BasicPanel{

    //panel的初始化，还没能调用action
    initPanel(){
        //this.create1LvBg(titleName, width, height, closeCallback, helpCallback/*可选*/);
        //this.create2LvBg(titleName, helpCallback/*可选*/, closeCallback/*可选*/);

        let map = this.getChildByName("map");
        map.addComponent(SceneMap);

        let player = this.getChildByName("map/player");
        player.addComponent(PlayerMove);
        this._playerMove = player.getComponent(PlayerMove);
        this._player = player;

        this._sceneMap = this.getChildByName("map/sceneMap");
        this._touchLayer = map;

        this._camera = player.getChildByName("camera").getComponent(cc.Camera);
    }

    //panel的节点事件注册
    registerEvents(){
        this.addTouchEventListener(this._touchLayer, (sender) => this.onSceneTouch(sender));

        // let testBtn = this.getChildByName("testBtn");
        // this.addTouchEventListener(testBtn, (sender) => this.onTestTouch(sender));
        let upBtn = this.getChildByName("widgetPanel/upBtn");
        let leftBtn = this.getChildByName("widgetPanel/leftBtn");
        let rightBtn = this.getChildByName("widgetPanel/rightBtn");
        let downBtn = this.getChildByName("widgetPanel/downBtn");

        this.addTouchEventListener(upBtn, () => this.onMoveTouch(0, 1));
        this.addTouchEventListener(leftBtn, () => this.onMoveTouch(-1, 0));
        this.addTouchEventListener(rightBtn, () => this.onMoveTouch(1, 0));
        this.addTouchEventListener(downBtn, () => this.onMoveTouch(0, -1));

    }

    onMoveTouch(dirX, dirY){
        // this._playerMove.move(dirX, dirY);
        this._playerMove.setDestination(cc.p(1380, -166));
    }

    onTestTouch(){
        this._playerMove.setDestination(cc.p(0, 0));

        //{x: -130, y: -332}
    }

    onSceneTouch(sender){
        let touch = sender.touch;
        var pos = this._sceneMap.convertToNodeSpaceAR(touch.getLocation());

        let cameraNode = this._player.getChildByName("camera");
        var des = cc.p(pos.x + this._player.x + cameraNode.x, pos.y + this._player.y + cameraNode.y);
        this._playerMove.setDestination(des);
    }

    //panel的初始化后，可能调用action了
    afterinitPanel(){        
    }

    //打开面板
    onShowHandle(){
    }

    //关闭面板
    onHideHandle(){
    }

    ////////////////渲染相关////////////////////////////
    render(){

    }

}

ScenePanel.NAME = "ScenePanel";
export default ScenePanel;