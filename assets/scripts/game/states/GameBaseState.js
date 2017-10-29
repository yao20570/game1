
import BaseState from "BaseState";
import AppEvent from "AppEvent";
import GameLayer from "GameLayer";
import logger from "Logger";
import Dispatcher from "Dispatcher";
import NetChannel from "NetChannel";
import AllComponent from "AllComponent";

class GameBaseState extends BaseState{
    constructor(){
        super();
        this._msgCenter = null;
		this._moduleMap = {};
		this._moduleClassMap = {};
		this._showModuleMap = {};
		this._game = null;
		this._msgCenter = null;
		this._gameLayer = null;

        this._gameDispatcher = null;  //游戏状态分发器，一个状态，只有一个

		this._uiDownloading = null;
		
		this.name = null;
        this._gameScene = null;
        
        this._iaAlive = false;

        this._uiMessage = null;
    }

    enter(game){
        super.enter();
        this._iaAlive = true
        this._game = game;
        this.initialize();
    }

    exit(owner, telegram){
        this._iaAlive = false
    }

    initialize(){
        this.initMsgCenter();
        this.createScene();
        this.registerModules();
    }

    //注册模块
    registerModules(){

    }

    //////////////////视图相关//////////////////////

    createScene(){
        let sceneName = "scenes/state";
        cc.director.loadScene(sceneName, () => {
            //场景加载完毕
            let scene = cc.director.getScene();
            this.afterCreateScene(scene);
        });
    }

    afterCreateScene(scene){
        this._gameScene = scene;
        this._gameLayer = new GameLayer();
        this.onLoad();
    }

    onLoad(){

    }

    addToLayer(layerName, node){
        let layer = this._gameLayer.getLayer(layerName);
        layer.addChild(node);
    }
    
    getLayer(layerName){
        let layer = this._gameLayer.getLayer(layerName);
        return layer;
    }

    //////////////事件相关////////////////////////

    initMsgCenter(){
        this._gameDispatcher = new Dispatcher();
        this._dispatchToken = this._gameDispatcher.register((payload) => {
            this.__invokeOnDispatch(payload);
        });
    }

    sendNotification(event, data){
        console.assert(event!=null, "event 未定义")
        this._gameDispatcher.dispatch({event : event, data : data});
    }

    __invokeOnDispatch(payload){
        let event = payload.event;
        let data = payload.data;

        //先将事件派发到目前打开的模块上
        for(let name in this._showModuleMap){
            let module = this._showModuleMap[name];
            if(module != null){
                module.gameActionHandler(event, data);
            }
        }

        switch (event){
            case AppEvent.MODULE_OPEN_EVENT:
                this.showModule(data);
                break;
            case AppEvent.MODULE_CLOSE_EVENT:
                this.closeModule(data);
                break;
            case AppEvent.NET_START_CONNECT:
                this.onConnectNetChannel(data);
                break;
            case AppEvent.GAME_STATE_CHANGE_EVENT:
                this.onChangeGameState(data);
                break;
            default:
                this.gameActionHandler(event, data);
                break;
        }
    }


    gameActionHandler(event, data){

    }

    onChangeGameState(data){
        let nextStateName = data.stateName;
        this._game.changeState(nextStateName)
    }

    onConnectNetChannel(server){
        let ip = server.ip;
        let port = server.port;
        this._game.addNetChannel(ip, port, NetChannel.GAME);
        this._game.launchNetChannel(NetChannel.GAME);
    }

    //获取代理数据
    getProxy(proxyName) {
        return this._game.getProxy(proxyName);
    }

    showModule(data){
        let moduleName = data["moduleName"];
        let module = this.getModule(moduleName);
        if(module == null){
            let moduleClass = this.getModuleClass(moduleName);
            if(moduleClass == null){
                logger.warn("%s---打开的模块不存在--", moduleName);
                return;
            }
            module = new moduleClass(new Dispatcher());
            this.addModule(moduleName, module);
        }

        //isAutoZOrder

        if(this._showModuleMap[moduleName] != null){
            logger.warn("--模块已打开:%s---", moduleName);
            return;
        }

        logger.info("--打开模块:%s---", moduleName);

        //showModuleHandler
        this._showModuleMap[moduleName] = module;
        module.showModule();
    }

    closeModule(data){
        let moduleName = data["moduleName"];
        let module = this.getModule(moduleName);
        logger.info("--关闭模块:%s---", moduleName);
        if (module == null){
            logger.warn("%s--模块不存在---", moduleName);
            return;
        }

        this._showModuleMap[moduleName] = null;
        delete this._showModuleMap[moduleName];

        module.hideModule();
    }

    registerModuleClass(name, moduleClass){
        this._moduleClassMap[name] = moduleClass;
    }

    getModuleClass(name){
        return this._moduleClassMap[name];
    }

    getModule(name){
        return this._moduleMap[name];
    }

    addModule(name, module){
        this._moduleMap[name] = module;
        module.setGameState(this);
    }

    removeModule(name){
        delete this._moduleMap[name];
    }

    
    //确认框
    showConfirm(content, okCallback, canCelcallback,okBtnName,canelBtnName, parent){
        logger.info("showConfirm ===> %s", content)
    }

    //消息
    showMessage(content){
        logger.info("showMessage ===> %s", content)
        let popLayer = this.getLayer("popLayer")
        if(this._uiMessage == null)
        {
            this._uiMessage = AllComponent.getInstantiate("UISysMessage");
            popLayer.addChild(this._uiMessage);

            let label = this._uiMessage.getChildByName("label");
            label.getComponent(cc.Label).string = content;
        }

        let action1 = cc.blink(1,3);
        let action2 = cc.fadeOut(0.5);
        let action3 = cc.callFunc(this.removeFromParent,this); 
        let action  = cc.sequence(action1,action2,action3);

        this._uiMessage.runAction(action);
    }

}

export default GameBaseState;