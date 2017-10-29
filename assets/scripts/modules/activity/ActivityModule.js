/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import ActivityView from "ActivityView";
import ActivityStore from "ActivityStore";
import ActivityAction from "ActivityAction";
import ActivityActionTypes from "ActivityActionTypes";

class ActivityModule extends BasicModule{
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
        let store = new ActivityStore(dispatch);
        let action = new ActivityAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new ActivityView(this, store, action);
        this._view.setModuleName(ActivityModule.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {

    }

    gameActionHandler(event, data){

    }

}
ActivityModule.NAME = "ActivityModule";

export default ActivityModule;
