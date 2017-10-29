
import GameBaseState from "GameBaseState";
import NetChannel from "NetChannel";
import ProtoManager from "ProtoManager";
import ConfigDataManager from "ConfigDataManager";
import ConfigName from "ConfigName";
import logger from "Logger";
import GameLayerName from "GameLayerName";
import BasicPanel from "BasicPanel";
import LoginModule from "LoginModule";
import AppEvent from "AppEvent";
import GameModule from "GameModule";
import GameModuleMap from "GameModuleMap";
import GameConfig from "GameConfig";
import PhoneInfo from "PhoneInfo";
import GameProxy from "GameProxy";

class SceneState extends GameBaseState {
    constructor() {
        super();

        //加载总数
        this._totalDownLoadCount = 0;
        //当前加载数
        this._curDownLoadCount = 0;
        //资源加载是否已经OK
        this._isPreLoadResOk = false;
        //预加模块是否已经OK
        this._isPreLoadModuleOk = false;
        //请求的数据是否已经Ok
        this._isServerDataOk = false;

        this._preLoadModuleList = [];
    }

    registerModules() {
        super.registerModules();

        let sceneModuleNameList = GameModuleMap.getSceneModuleNameList();
        for (let index in sceneModuleNameList) {
            let moduleName = sceneModuleNameList[index];
            let module = GameModuleMap.getModule(moduleName);
            this.registerModuleClass(moduleName, module);
        }
    }

    //scene加载完成
    onLoad() {
        super.onLoad();

        //直接网关请求 登录网关成功了
        this.onLoginGateResp({ rs: 0 });

        //因为资源加载异步，必须先将加载模块加载完再加载其它资源
        this.openModuleLoading();
    }



    //预加载资源
    onPreLoadRes() {
        this.initPreLoadRes();
        this.preLoadPrefab();
    }

    initPreLoadRes(){
        let prefabUrlList = [
            "ui/panel/toolbar/ToolbarPanel",
            "ui/panel/mainScene/MainScenePanel",
        ];
        let ary = [
            GameModule.MainSceneModule,
            //GameModule.ChatModule,
            GameModule.ToolbarModule,
            GameModule.RoleInfoModule,
        ]
        //判断是否存在角色
        if(!this.getProxy(GameProxy.Role).isHasRole()){
            prefabUrlList.push("ui/panel/createRole/CreateRolePanel")
            ary.push(GameModule.CreateRoleModule)
        }

        this._prefabUrlList = prefabUrlList;
        this._moduleLoadList = ary;

        this._totalDownLoadCount = prefabUrlList.length + ary.length;
    }

    //预加载prefab
    preLoadPrefab(){
        for (let index in this._prefabUrlList) {
            let url = this._prefabUrlList[index];
            this.loadPrefab(url);
        }

    }

    loadPrefab(url){
        ++this._totalDownLoadCount;
        cc.loader.loadRes(url, (err, prefab) => {
            ++this._curDownLoadCount;
            this.updateLoadingProgress();
            if(this._curDownLoadCount == this._prefabUrlList.length){
                this.onPreLoadModule();
            }
        });
    }

    //预加载模块prefab
    onPreLoadModule() {

        for (let index in this._moduleLoadList) {
            let moduleName = this._moduleLoadList[index];
            logger.info("=======>预加载模块:%s", moduleName);
            ++this._totalDownLoadCount;
            this._preLoadModuleList.push(moduleName);
            this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: moduleName});  //TODO 这个回调，还需要进一步优化
        }

        //先模拟加载
        this.updateLoadingModuleProgress();

    }

    //更新模块进度
    updateLoadingModuleProgress() {
        ++this._curDownLoadCount;
        this.updateLoadingProgress();

        //TODO:等loadingModule完成修改下面代码
        //等loading回调打开登录模块
        if (this._curDownLoadCount == this._totalDownLoadCount) {
            this._isPreLoadResOk = true;
            this.enterScene();
        }else {
            setTimeout(() => this.updateLoadingModuleProgress(), 100)
        }
    }

    updateLoadingProgress(){
        let progress = Math.ceil(this._curDownLoadCount / this._totalDownLoadCount * 100);
        this.sendNotification(AppEvent.LOADER_UPDATE_PROGRESS, { moduleName: GameModule.LoginModule, loadProgress: progress });
    }


    //打开加载模块
    openModuleLoading() {
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.LoaderModule });
    }

    hideModuleLoading(){
        this.sendNotification(AppEvent.MODULE_CLOSE_EVENT, { moduleName: GameModule.LoaderModule });
    }

    hideAllPreLoadModule(){
        for (let index in this._preLoadModuleList) {
            let moduleName = this._preLoadModuleList[index];
            this.sendNotification(AppEvent.MODULE_CLOSE_EVENT, { moduleName: moduleName });
        }
    }




    enterScene() {
        if (!this._isPreLoadResOk) {
            return;
        }

        if (!this._isServerDataOk) {
            //TODO:协议还没处理好，先通过
            return;
        }

        // if (!this._isPreLoadModuleOk) {
        //     return;
        // }


        this.hideModuleLoading();
        this.hideAllPreLoadModule();
        if(!this.getProxy(GameProxy.Role).isHasRole()){
            this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.CreateRoleModule });
        }
        logger.info("===============>enter Scene");
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.MainSceneModule });
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.ToolbarModule });
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.RoleInfoModule });

    }


    //打开登录模块
    openModuleLogin() {
        // let loginModuleName = GameModule.LoginModule;
        // logger.info(loginModuleName);
        // let loginModule = GameModuleMap.getModule(loginModuleName);
        //
        // this.registerModuleClass(GameModuleMap.GameModule.LoginModule, loginModule);
        //
        // this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: loginModuleName });
    }

    gameActionHandler(event, data) {
        super.gameActionHandler(event, data);

        switch (event) {
            case AppEvent.LOADER_START:
                this.onPreLoadRes();
                break;
            case AppEvent.PROXY_SYSTEM_LOGINGATE:
                this.onLoginGateResp(data);
                break;
            case AppEvent.PROXY_SYSTEM_LOGIN:
                this.onLoginResp(data);
                break;
            case AppEvent.PROXY_GET_ROLE_INFO:
                this._isServerDataOk = true;
                this.enterScene();
                break;
        }
    }

    //网关登录      
    onLoginGateResp(data) {
        // let serverTime = GameConfig.serverTime
        // let now = new Date()
        // if (now - serverTime >= 30 * 60){
        //     //重连成功后，如果大于半小时的时间，则直接重登游戏
        //     this.onGameLogoutHandler()  
        //     return
        // }

        this.sceneReLogin()
    }

    //登出游戏
    onGameLogoutHandler(data) {
    }

    //场景中重新登录
    sceneReLogin() {
        // this._lastHeartbeatTime = new Date()
        // GameConfig.lastHeartbeatTime = new Date()
        // GameConfig.isInitRoleInfo = false

        // let roleProxy = this.getProxy(GameProxy.Role)
        // let isInitInfo = roleProxy.isInitInfo()
        // if (isInitInfo == true ){ 
        //     //数据初始化完毕，才证明是重登的
        //     self._reLogin = true
        // }

        //请求登录
        let areId = GameConfig.serverId;
        //let loginData = PhoneInfo.getLoginData(GameConfig.accountName, areId)
        let loginData = { account: GameConfig.accountName, areId: areId };
        let systemProxy = this.getProxy(GameProxy.System);
        systemProxy.onTriggerNet10000Req(loginData)
    }

    //被动退出    
    onOtherLoginResp() {
    }

    //心跳
    onHeartbeatResp(data) {
    }

    //登录
    onLoginResp(data) {
        let rs = data.rs
        if (rs == 0 || rs == 5) {
            // if (rs == 5) {
            //     GameConfig.isNewPlayer = true;
            // }
            // GameConfig.isLoginSucess = true;
        }
        else if (rs == -1) {
            // //没有角色
            // GameConfig.isLoginSucess = true;
        }

        if (rs == 0 || rs == 5) {
            //登录成功
            GameConfig.isLoginSucess = true;


            GameConfig.serverTime = data.serverTime;

            this.roleInfoReq() //角色信息请求

            // let isfirstLogin = LocalDBManager.getValueForKey("firstLogin", nil, "");
            // if (isfirstLogin == nil) {
            //     this.gameEventLog(EventConfig.ReqRoleInfo);
            // }

            //KKKLog.accountLoginLog();
        }
        else if (rs == -2) {//被封号了！
            // let parent = this.getLayer(GameLayer.popLayer);
            // let reason = rawget(data, "reason");
            // if (reason == nil || reason == "") {
            //     reason = TextWords.getTextWord(14);
            // }
            // let box = this.showMessageBox(reason, nil, nil, nil, nil, parent);
            // box.setLocalZOrder(12345);
            // this.sendNotification(AppEvent.NET_EVENT, AppEvent.NET_AUTO_CLOSE_CONNECT, {}); //断开连接
        }
        else if (rs == -3) {//IP被封了
            // let parent = this.getLayer(GameLayer.popLayer);
            // let box = this.showMessageBox(TextWords.getTextWord(19), nil, nil, nil, nil, parent);
            // box.setLocalZOrder(12345);
            // this.sendNotification(AppEvent.NET_EVENT, AppEvent.NET_AUTO_CLOSE_CONNECT, {});  //断开连接
        }
        else {
            //登录失败
            // logger.error("===重登登录失败！！！=====");
            // let parent = this.getLayer(GameLayer.popLayer);
            // let box = this.showMessageBox(TextWords.getTextWord(15), nil, nil, nil, nil, parent);
            // box.setLocalZOrder(12345);
            // this.sendNotification(AppEvent.NET_EVENT, AppEvent.NET_AUTO_CLOSE_CONNECT, {});  //断开连接
        }
    }

    //充值成功
    onChargeSucessResp(data) {

    }

    //请求角色信息
    roleInfoReq(){        
        this.sendNotification(AppEvent.NET_M2, AppEvent.NET_M2_C20000, {});

        let roleProxy = this.getProxy(GameProxy.Role);
        roleProxy.onTriggerNet20000Req()

    }
    
}


export default SceneState;