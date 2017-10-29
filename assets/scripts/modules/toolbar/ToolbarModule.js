/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import ToolbarView from "ToolbarView";
import ToolbarStore from "ToolbarStore";
import ToolbarAction from "ToolbarAction";
import ToolbarActionTypes from "ToolbarActionTypes";
import AppEvent from "AppEvent"
import GameLayerName from "GameLayerName";

class ToolbarModule extends BasicModule{
    constructor(dispatcher){
        super(dispatcher);
        this._view = null;

        this.__uiLayerName = GameLayerName.ui2Layer;
    }

    finalize(){
        super.finalize();
    }

    initModule(){
        super.initModule();
        this.getModuleNode().setLocalZOrder(1);//提高层级
        //设置分发监听绑定
        let dispatch = this.getDispatcher();
        let store = new ToolbarStore(dispatch);
        let action = new ToolbarAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new ToolbarView(this, store, action);
        this._view.setModuleName(ToolbarModule.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {
        switch (type) 
        {
            case ToolbarActionTypes.SHOW_OTHER_EVENT:
            this.sendNotification(AppEvent.MODULE_OPEN_EVENT, {moduleName: data.moduleName});
            //暂时处理
            break;
            case ToolbarActionTypes.HIDE_OTHER_EVENT:
                this.sendNotification(AppEvent.MODULE_CLOSE_EVENT, {moduleName: data.moduleName});
        }
    }

    gameActionHandler(event, data){

    }

}
ToolbarModule.NAME = "ToolbarModule";

export default ToolbarModule;
