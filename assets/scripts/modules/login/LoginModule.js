/**
 * Created by on 2017/9/25.
 */

import BasicModule from "BasicModule";
import LoginView from "LoginView";
import LoginStore from "LoginStore";
import LoginAction from "LoginAction";
import GameConfig from "GameConfig";
import HttpRequestManager from "HttpRequestManager";
import logger from "Logger";
import LoginActionTypes from "LoginActionTypes";
import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameState from "GameState";
import GameModule from "GameModule";

class LoginModule extends BasicModule {
    constructor(dispatcher) {
        super(dispatcher);
        this._view = null;
    }

    finalize() {
        super.finalize();
    }

    initModule() {
        super.initModule();
        let dispatch = this.getDispatcher();
        let store = new LoginStore(dispatch);
        let action = new LoginAction(dispatch);
        this.setAction(action);
        this._view = new LoginView(this, store, action);
        this._view.setModuleName(LoginModule.NAME);
        this._view.showDefaultPanel();

        this.getServerListInfo();
    }

    getServerListInfo() {
        let params = {};
        params["game_id"] = GameConfig.gameId;
        params["os"] = GameConfig.osName;
        params["plat_id"] = GameConfig.platformChanleId;
        params["channel_id"] = GameConfig.channelId;
        params["client_version"] = GameConfig.mainVersion + "." + GameConfig.localVersion; // --这个版本号，是用来审核的，用包的版本号为依据
        params["client_version_real"] = GameConfig.clientVersion;
        params["service"] = "Server.GetServerList";
        params["test"] = GameConfig.isTest;
        params["mac"] = ""; //PhoneInfo:getInfoByKey("mac") or ""  --修改成mac
        HttpRequestManager.send(GameConfig.server_list_url, params, (info) => this.onGetServerListSuccess(info));
    }

    onGetServerListSuccess(info) {
        logger.info("获取到服务器列表信息:%s", info);
        this.getAction().getServerList(info);
    }

    panelActionHandler(type, data) {
        switch (type) {
            case LoginActionTypes.CONNECT_SERVER:
                logger.info("!!!!!!panelActionHandler!!!!!CONNECT_SERVER!!!", data);
                this.connectServer(data.server, data.accountName);
                break;
            case LoginActionTypes.SHOW_OTHER_EVENT:
                logger.info("LoginActionTypes.SHOW_OTHER_EVENT, 执行切换", data);
                this.onShowOtherHandler(data);
                break;
            case LoginActionTypes.CLOSE_LOADER_MODULE:
                this.sendNotification(AppEvent.MODULE_CLOSE_EVENT, { moduleName: GameModule.LoaderModule });
                break;

        }
    }

    //连接服务器
    connectServer(server, accountName) {

        let ip = server.ip;
        let port = server.port;

        logger.info("!!!!连接服务器!!:%s!!%s!%s!", ip, port, accountName);

        GameConfig.serverIp = ip;
        GameConfig.port = parseInt(port);
        GameConfig.accountName = accountName;
        GameConfig.serverName = server.name;
        GameConfig.serverId = server.serverId;

        //存帐服数据
        this.setLocalStorageByKey("accountName", accountName);
        this.setLocalStorageByKey("serverId", server.serverId);

        this.sendNotification(AppEvent.NET_START_CONNECT, server);
        
    }

    //模块跳转函数
    onShowOtherHandler(data){
        logger.info("打开模块" + data.moduleName);
        //let module = GameModuleObj.getModule(data.moduleName);
        //this.registerModuleClass(data.moduleName, module);
//
        //this.getGameState().registerModuleClass(data.moduleName, module);
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, {moduleName : data.moduleName});
    }

    /**
     * 方法说明 通用事件入口sendNotification
     * @method gameActionHandler
     * @for BasicModule
     * @param event 属于AppEvent
     * @param data  事件数据
     * @return null
     */
    gameActionHandler(event, data){
        switch (event){
            case AppEvent.NET_SUCCESS_CONNECT:
                logger.info("!!!!游戏连接成功!!!!!!!");                
                this.netConnectSuccess();
                break;
            case AppEvent.PROXY_SYSTEM_LOGINGATE:
                this.onLoginGateResp(data);
                break;
            case AppEvent.NET_FAIL_CONNECT:
                logger.info("!!!!游戏连接失败!!!!!!!");
                this.netConnectFail();
                break;
        }
    }

    //连接服务成功
    netConnectSuccess(){
        this.onLoginGateReq();
    }

    //连接服务器失败
    netConnectFail(){
        GameConfig.isLoginSucess = false
        this._loginData = null
            
        this._isStartLoginReq = false
    }

    /**
     * 方法说明 请求登录网关
     * @method onLoginGateReq
     * @for LoginModule
     * @param null
     * @return null
     */
    onLoginGateReq(){
        let areId = GameConfig.serverId
        let data = {account : GameConfig.accountName, type : 1, areId : areId}
        this.getProxy(GameProxy.System).onTriggerNet9999Req(data)
    }

    /**
     * 方法说明 请求登录网关成功后切换状态
     * @method onLoginGateResp
     * @for LoginModule
     * @param data 服务器返回数据
     * @return null
     */
    onLoginGateResp(data){
        if(data.rs == 0){ //网关登录成功 请求登录到服务器
            this.toSceneState()
        }
    }

    /**
     * 方法说明 请求登录网关成功后切换状态
     * @method toSceneState
     * @for LoginModule
     * @param null
     * @return null
     */
    toSceneState(){
        this.changeGameState() 
        this.setPushTags()
    }

    /**
     * 方法说明 请求登录网关成功后切换状态
     * @method changeGameState
     * @for LoginModule
     * @param null
     * @return null
     */
    changeGameState(){
        let data = {};
        data.stateName = GameState.Scene;
        // data.stateName = "Scene";
        this.sendNotification(AppEvent.GAME_STATE_CHANGE_EVENT, data);
    }

    /**
     * 方法说明 登录成功后，直接设置推送tags todo
     * @method setPushTags
     * @for LoginModule
     * @param null
     * @return null
     */
    setPushTags(){
        // local serverId = "S" .. GameConfig.serverId
        // local platId = "P" .. GameConfig.platformChanleId 
        // local version = "V" .. GameConfig.version
        // local tags = {serverId, platId, version}
        // SDKManager:setPushTags(tags)
    }

    

}

LoginModule.NAME = "LoginModule";
export default LoginModule;