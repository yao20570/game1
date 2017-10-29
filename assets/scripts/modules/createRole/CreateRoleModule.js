/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import CreateRoleView from "CreateRoleView";
import CreateRoleStore from "CreateRoleStore";
import CreateRoleAction from "CreateRoleAction";
import CreateRoleActionTypes from "CreateRoleActionTypes";
import GameProxy from "GameProxy";
import AppEvent from "AppEvent";

class CreateRoleModule extends BasicModule{
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
        let store = new CreateRoleStore(dispatch);
        let action = new CreateRoleAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new CreateRoleView(this, store, action);
        this._view.setModuleName(CreateRoleModule.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {
        switch(type){
            case CreateRoleActionTypes.Create_Role:
                this.createRole(data)
                break;
            case CreateRoleActionTypes.SHOW_OTHER_EVENT:
                this.showOtherHandler(data);
        }
    }

    //模块跳转函数
    showOtherHandler(data){
        logger.info("打开模块" + data.moduleName);
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, {moduleName : data.moduleName});
    }

    gameActionHandler(event, data){
        switch(event){
            case AppEvent.PROXY_CREATE_ROLE_SUCCESS:
                this.createRoleSuccess(data)
                break;
        }
    }

    /**
     * 方法说明 请求创建角色
     * @method onLoginGateReq
     * @for LoginModule
     * @param null
     * @return null
     */
    createRole(data){
        // self:sendServerMessage(AppEvent.NET_M2, AppEvent.NET_M2_C20008, data)
        this.getProxy(GameProxy.Role).onTriggerNet20008Req(data)
    }

    /**
     * 方法说明 创建角色完成回调
     * @method createRoleSuccess
     * @param data 服务器数据可以不用管,在proxy已经判断了
     * @return null
     */
    createRoleSuccess(data){
        this.hideModule()
    }

}
CreateRoleModule.NAME = "CreateRoleModule";

export default CreateRoleModule;
