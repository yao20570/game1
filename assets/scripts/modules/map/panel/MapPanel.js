/**
 * Created by on 2017/10/17.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import AllComponent from "AllComponent";

class MapPanel extends BasicPanel{

    //panel的初始化，还没能调用action
    initPanel(){
        //创建WorldMap
        this.createWorldMap()
    }

    //panel的节点事件注册
    registerEvents(){
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

    //创建WorldMap
    createWorldMap(){

        //let uiComponent = this.getComponent("UIComponent");
        //let uiBaseMap = cc.instantiate(uiComponent.UIComponents[0]);
        //this.addChild(uiBaseMap);
        //this._worldMap = uiBaseMap.getComponent("UIBaseMap")
        //this._worldMap.testCallBack();

        let map = this.getComponentNode("UIBaseMap")
        this.addChild(map);
        this._worldMap = map.getComponent("WorldMap");
        this._worldMap.initWorldMap(this);
    }

    testWorldMapInit(){
        logger.info("==========================")
        logger.info("==========================")
        logger.info("==========================")
    }

    ////////////////渲染相关////////////////////////////
    render(){

    }

}

MapPanel.NAME = "MapPanel";
export default MapPanel;