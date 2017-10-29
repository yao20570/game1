import StateMachine from "StateMachine";
import GameState from "GameState";
import GameStateMap from "GameStateMap";
import NetChannel from "NetChannel";
import GameProxyMap from "GameProxyMap";
import PhoneInfo from "PhoneInfo"
import logger from "Logger";
import GameTest from "GameTest";
import Debug from "Debug";

class Game {

    constructor() {
        this._stateMap = {};
        this._stateMachine = null;
        this._curState = null;
        this._netChannelMap = {};
        this._proxyMap = {};

        this.initConfig();
        this.initPhoneInfo();
        this.addStateMachine();
        this.registerProxys();

        Debug.create(this);
    }

    initConfig(){
        if (cc.sys.os != cc.sys.OS_WINDOWS) {
            logger.setLevel(1);
            cc.director.setDisplayStats(false);
        }

        GameTest.debug();
    }

    startGame() {
        let curState = this._stateMachine.getCurState();
        curState.enter(this);
    }

    gameLogout() {
        this.resetProxy();
    }

    initPhoneInfo() {
        // let phoneInfo = AppUtils.getPhoneInfo()
        // // logger.error("==not==error==initPhoneInfo=========.%s====", phoneInfo)
        // require("json")
        // let function decode()
        //     let result = json.decode(phoneInfo)
        //     return result
        // end
        // let status, phoneInfoData = pcall(decode)
        // if status ~= true then
        //     logger.error("~~~~~~~initPhoneInfo解析失败~~~~~~~~~~~~~~~")
        //     phoneInfoData = {}
        // end

        PhoneInfo.init({} /*phoneInfoData*/)
        // GameConfig.setPackageInfo(phoneInfoData.packageInfo or -1)

        // GameConfig.localVersion = phoneInfoData.localVersion or 0
    }

    addStateMachine() {
        this.initState();

        this._stateMachine = new StateMachine(this);
        let initStateName = GameState.Login;
        let state = this.getState(initStateName);
        this._stateMachine.setCurState(state);
        this._curState = state;
    }

    initState() {
        for (var key in GameStateMap) {
            let stateCls = GameStateMap[key];
            this._stateMap[key] = new stateCls();
        }
    }

    getCurState() {
        return this._stateMachine.getCurState();
    }

    getState(stateName) {
        return this._stateMap[stateName];
    }

    changeState(stateName) {
        let state = this.getState(stateName);
        this._curState = state;
        this._stateMachine.changeState(state);
    }

    //////////////数据代理类////////////////
    registerProxys() {
        for (var name in GameProxyMap) {
            let cls = GameProxyMap[name];
            this.registerProxy(name, cls);
        }
    }

    registerProxy(name, cls) {
        let proxy = new cls();
        proxy.setGame(this);
        this._proxyMap[name] = proxy;
    }
    
    resetProxy() {
        for (name in this._proxyMap) {
            proxy.resetAttr()
        }
    }

    /**
     * 方法说明 把已经解析的网络数据,一个一个代理的分发出去
     * @method dispatchRecvData
     * @for NetChannel
     * @param 
     * @return 
     */
    dispatchRecvData(recvData) {
        let mId = recvData.mId
        let cmdId = recvData.cmdId
        let data = recvData.data
        let funName = "onTriggerNet" + cmdId + "Resp"

        for (name in this._proxyMap) {            
            let proxy = this._proxyMap[name]
            let func = proxy[funName]
            if (func) {
                func.call(proxy, data)
            }
        }

    }

    //////////////////////////////

    isGameNetConnected() {
        let netChannel = this._netChannelMap[NetChannel.GAME];
        if (netChannel == null) {
            return false
        }
        return netChannel.isConnected()
    }

    //新增网络管道
    addNetChannel(ip, port, netChannelName) {
        let netChannel = new NetChannel(ip, port);
        // let netChannelName = this.getNetChannelName(ip, port);
        netChannel.setGame(this);
        this._netChannelMap[netChannelName] = netChannel;
    }

    launchNetChannel(netChannelName) { //ip, port
        // let netChannelName = this.getNetChannelName(ip, port);
        let netChannel = this._netChannelMap[netChannelName];
        netChannel.launch();
    }

    sendGameChannelNet(data) {
        let netChannel = this._netChannelMap[NetChannel.GAME];
        netChannel.sendNet(data);
    }

    recvNet(cmdId, data) {

    }

    closeNetChannel(netChannelName) {  //ip, port
        // let netChannelName = this.getNetChannelName(ip, port);
        let netChannel = this._netChannelMap[netChannelName];
        netChannel.close();
    }

    scheduleNetChannel(dt) {
        for (let key in this._netChannelMap) {
            this._netChannelMap[key].onProtoSchedule(dt)
        }
    }

    // getNetChannelName(ip, port) {
    //     return ip + port;
    // }

    //获取代理
    getProxy(name) {
        return this._proxyMap[name]
    }

    scheduleProxy(dt) {
        for (let key in this._proxyMap) {
            this._proxyMap[key].update(dt)
        }
    }

    update(dt) {
        this.scheduleNetChannel(dt)

        this.scheduleProxy(dt)
    }


}

export default Game;