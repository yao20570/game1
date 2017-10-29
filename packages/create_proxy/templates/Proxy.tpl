/**
 * Created by on 2017/9/28.
 */
import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";
import GameConfig from "GameConfig";
import GameProxy from "GameProxy";
import GameModule from "GameModule"
import ConfigName from "ConfigName";
import ConfigDataManager from "ConfigDataManager";

class #proxyName#Proxy extends BasicProxy {
    constructor() {
        super();        
    }

    //重置数据，在切换账号的时候重置调用
    resetAttr() {
    }

    //数据代理全部初始化前调用
    beforeInitSyncData() {
    }

    //数据代理初始化
    initSyncData(data) {        
    }

    //数据代理全部初始化完后调用
    afterInitSyncData() {
    }

    //每天数据重置调用
    resetCountSyncData(data) {
    }

    //===========================================公用函数===============================================

    //getXXXX(){}
    //setXXX(){}


    //============================================协议===================================================
    
    //onTriggerNet20000Req() {
    //    this.syncNetReq(AppEvent.NET_M2, AppEvent.NET_M2_C20000, {})
    //}
    //onTriggerNet20000Resp(data) {
    //    
    //}
}

export default #proxyName#Proxy;