/**
 * Created by on 2017/9/28.
 */
import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";
import ConfigDataManager from "ConfigDataManager";
import GameConfig from "GameConfig"
import ConfigName from "ConfigName";
import ErrorCodeConfig from "ErrorCodeConfig";


class SystemProxy extends BasicProxy {
    constructor() {
        super();
        logger.info("!!!初始化!!!SystemProxy!!")
    }

    
    //请求网关
    onTriggerNet9999Req(data) {
        logger.info("onTriggerNet9999Req")
        this.syncNetReq(AppEvent.NET_M1, AppEvent.NET_M1_C9999, data)
    }
    onTriggerNet9999Resp(data) {
        cc.log("接受到onTriggerNet9999Resp 的返回")

        logger.info("!!!!!!!!!!网关登录返回!!!!!!!!!!!!!!rs:%d!!", data.rs)
        // let config = ;
        if (data.rs == ErrorCodeConfig.M9999_1) {
            GameConfig.isServerFull = true
        }

        if (data.rs == ErrorCodeConfig.M9999_2 || data.rs == ErrorCodeConfig.M9999_3) {

            this._lastGateResp = new Date() //最后一次收到网关信息，证明还有个服务端通讯
            // GameConfig.isInGateQueue = true
            // //////进入排队界面
            // let queueNum = data.queueNum
            // this.updateGateQueueNum(queueNum)
            // let str = this.getQueueContent(this._curQueueTime)

            // let okCallback = function(){
            //     this._queueBox = nil

            //     if(!this.isLoginState()){
            //         SDKManager.gameLogout()
            //     }else{
            //         this.onTriggerNet9988Req()
            //     }
            // }
            // let canCelcallback = function(){
            //     this._queueBox = nil

            //     if(! this.isLoginState()){
            //         SDKManager.gameLogout()
            //     }else{
            //         this.onTriggerNet9988Req()
            //     }
            // }

            // let popLayer = this.getCurGameLayer(GameLayer.popLayer)
            // this._queueBox = this.showMessageBox(str, nil, canCelcallback , TextWords.getTextWord(17), nil, popLayer)
            // this._queueBox.setTitleName("登录排队")
            // this._queueBox.setLocalZOrder(9999)

            logger.info("登录排队")
        } else   {
            GameConfig.isInGateQueue = false
            this.sendNotification(AppEvent.PROXY_SYSTEM_LOGINGATE, data)
        }


    }

    //请求登录
    onTriggerNet10000Req(data) {
        this.syncNetReq(AppEvent.NET_M1, AppEvent.NET_M1_C10000, data)
    }
    onTriggerNet10000Resp(data) {
        this.sendNotification(AppEvent.PROXY_SYSTEM_LOGIN, data)
    }

}

export default SystemProxy;