/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import SceneView from "SceneView";
import SceneStore from "SceneStore";
import SceneAction from "SceneAction";
import SceneActionTypes from "SceneActionTypes";

import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameModule from "GameModule"; 
import GameConfig from "GameConfig";
import GameLayerName from "GameLayerName";

class SceneModule extends BasicModule{
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
        let store = new SceneStore(dispatch);
        let action = new SceneAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new SceneView(this, store, action);
        this._view.setModuleName(SceneModule.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {

    }

    gameActionHandler(event, data){

    }

}
SceneModule.NAME = "SceneModule";

export default SceneModule;
