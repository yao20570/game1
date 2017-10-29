/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import MainSceneView from "MainSceneView";
import MainSceneStore from "MainSceneStore";
import MainSceneAction from "MainSceneAction";
import MainSceneActionTypes from "MainSceneActionTypes";
import GameProxy from "GameProxy";
import AppEvent from "AppEvent";
import GameLayerName from "GameLayerName";


class MainSceneModule extends BasicModule{
    constructor(dispatcher){
        super(dispatcher);
        this._view = null;

        this.__uiLayerName = GameLayerName.uiLayer;
    }

    finalize(){
        super.finalize();
    }

    initModule(){
        super.initModule();
        //设置分发监听绑定
        let dispatch = this.getDispatcher();
        let store = new MainSceneStore(dispatch);
        let action = new MainSceneAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new MainSceneView(this, store, action);
        this._view.setModuleName(MainSceneModule.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {
        logger.info("*****执行 panelActionHandler*****");
        switch(type){
            case MainSceneActionTypes.LOAD_COMPLETE:
            case MainSceneActionTypes.BUILDING_UPGRATE_REQ:
                this.getProxy(GameProxy.Building).onTriggerNet280001Req(data);
            case MainSceneActionTypes.BUILDING_UPGRATE_REV:
                this.getProxy(GameProxy.Building).onTriggerNet280003Req(data);
            case MainSceneActionTypes.BUILDING_UPGRATE_QUICK:
                this.getProxy(GameProxy.Building).onTriggerNet280004Req(data);
            case MainSceneActionTypes.BUILDING_REMOVE_FIELD:
                this.getProxy(GameProxy.Building).onTriggerNet280005Req(data);
            case MainSceneActionTypes.BUILDING_PRODUCT_REQ:
                this.getProxy(GameProxy.Building).onTriggerNet280006Req(data);
            case MainSceneActionTypes.BUILDING_PRODUCT_REV:
                this.getProxy(GameProxy.Building).onTriggerNet280008Req(data);
            case MainSceneActionTypes.BUILDING_PRODUCT_QUICK:
                this.getProxy(GameProxy.Building).onTriggerNet280009Req(data);
            break;
        }
    }
    
    gameActionHandler(event, data){
        logger.info("*****执行 gameActionHandler*****");

    }

}
MainSceneModule.NAME = "MainSceneModule";

export default MainSceneModule;
