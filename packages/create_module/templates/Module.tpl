/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import #moduleName#View from "#moduleName#View";
import #moduleName#Store from "#moduleName#Store";
import #moduleName#Action from "#moduleName#Action";
import #moduleName#ActionTypes from "#moduleName#ActionTypes";

import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameModule from "GameModule"; 
import GameConfig from "GameConfig";

class #moduleName#Module extends BasicModule{
    constructor(dispatcher){
        super(dispatcher);
        this._view = null;
    }

    finalize(){
        super.finalize();
    }

    initModule(){
        super.initModule();
        //设置分发监听绑定
        let dispatch = this.getDispatcher();
        let store = new #moduleName#Store(dispatch);
        let action = new #moduleName#Action(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new #moduleName#View(this, store, action);
        this._view.setModuleName(#moduleName#Module.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {

    }

    gameActionHandler(event, data){

    }

}
#moduleName#Module.NAME = "#moduleName#Module";

export default #moduleName#Module;
