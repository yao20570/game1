/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import RoleInfoView from "RoleInfoView";
import RoleInfoStore from "RoleInfoStore";
import RoleInfoAction from "RoleInfoAction";
import RoleInfoActionTypes from "RoleInfoActionTypes";
import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameLayerName from "GameLayerName";

class RoleInfoModule extends BasicModule{
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
        //设置分发监听绑定
        let dispatch = this.getDispatcher();
        let store = new RoleInfoStore(dispatch);
        let action = new RoleInfoAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new RoleInfoView(this, store, action);
        this._view.setModuleName(RoleInfoModule.NAME);
        this._view.showDefaultPanel();

        this.initRoleData()
    }

    panelActionHandler(type, data) {
        switch (type) {
        }
    }

    gameActionHandler(event, data){
        switch(event){
            case AppEvent.PROXY_GET_ROLE_INFO:
                this.getAction().initRoleData(data)
                break;
        }
    }


    initRoleData(){
        // this._roleProxy = this.getProxy(GameProxy.Role)
        // this.getAction().initRoleData(this._roleProxy.getActorInfo())
        this.getAction().initRoleData()
    };

}
RoleInfoModule.NAME = "RoleInfoModule";

export default RoleInfoModule;
