import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";



class ChatProxy extends BasicProxy {
    constructor() {
        super();
        this._aLLChatInfo= []
        this._tempChatInfo = []
    }

    //重置数据，在切换账号的时候重置调用
    resetAttr() {
    }

    //数据代理全部初始化前调用
    beforeInitSyncData() {
    }

    //数据代理初始化
    initSyncData(data) {
        data = this.afterData
       
    }

    //数据代理全部初始化完后调用
    afterInitSyncData() {
    }

    //每天数据重置调用
    resetCountSyncData(data) {
    }

    //聊天 自己发出 
    onTriggerNet140000Req(data)
    {   
        logger.info("发出了一波数据 ",data)
        //先发一条数据出去再说
        this.syncNetReq(AppEvent.NET_M14, AppEvent.NET_M14_C140000, data);
    }
    //聊天 发出后接收
    onTriggerNet140000Resp(data)
    {
        if(data.rs == 0)
        {
            logger.info("接收到一波数据 ")
            
            this.sendNotification(AppEvent.GET_CHATINFO,data)
        }
        else
        {
            logger.info("发送的数据 不对劲")
        }

    }

}

export default ChatProxy;