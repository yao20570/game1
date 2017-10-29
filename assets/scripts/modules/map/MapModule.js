/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import MapView from "MapView";
import MapStore from "MapStore";
import MapAction from "MapAction";
import MapActionTypes from "MapActionTypes";

import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameModule from "GameModule"; 
import GameConfig from "GameConfig";
import GameLayerName from "GameLayerName";

class MapModule extends BasicModule{
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
        let store = new MapStore(dispatch);
        let action = new MapAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new MapView(this, store, action);
        this._view.setModuleName(MapModule.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {

    }

    gameActionHandler(event, data){

    }

}
MapModule.NAME = "MapModule";

export default MapModule;
