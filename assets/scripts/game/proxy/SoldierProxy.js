/**
 * Created by on 2017/9/28.
 */
import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameModule from "GameModule"
import GameConfig from "GameConfig";
import ConfigDataManager from "ConfigDataManager";
import ConfigName from "ConfigName";

class SoldierProxy extends BasicProxy {
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

    //注意:你还得需要到
    //assets/scripts/game/const/GameProxy.js
    //assets/scripts/game/const/GameProxyMap.js
    //这两个文件去注册该SoldierProxy

    //===========================================公用函数===============================================

    updateSoldiersList(soldiersList) {
        // this.onDicData(soldiersList, 1)
        // this.soldierMaxFightChange()


        // let isShow = this.onShowMaxFightModules()
        // if (isShow == true){
        //     this.setMaxFighAndWeight()
        // }
        
        // this.delaySendNotification(AppEvent.PROXY_SOLIDER_MOFIDY)
        // this.setCheckExample()
        // this.updateSetTeamInfo()
        // this.updateDefTeamInfo()
        // this.updatePveTeamInfo()
    }




    //============================================协议===================================================

    //onTriggerNet20000Req() {
    //    this.syncNetReq(AppEvent.NET_M2, AppEvent.NET_M2_C20000, {})
    //}
    //onTriggerNet20000Resp(data) {
    //    
    //}
}

export default SoldierProxy;