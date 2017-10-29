/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import ChatView from "ChatView";
import ChatStore from "ChatStore";
import ChatAction from "ChatAction";
import ChatActionTypes from "ChatActionTypes";

import GameProxy from "GameProxy";
import AppEvent from "AppEvent";

class ChatModule extends BasicModule{
    constructor(dispatcher){
        super(dispatcher);
        this._view = null;
    }

    finalize(){
        super.finalize();
    }

    initModule(){
        super.initModule();
        logger.info("为什么这个模块会预先被加载")
        //设置分发监听绑定
        let dispatch = this.getDispatcher();
        let store = new ChatStore(dispatch);
        let action = new ChatAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new ChatView(this, store, action);
        this._view.setModuleName(ChatModule.NAME);
        this._view.showDefaultPanel();

    }

    panelActionHandler(type, data) {
        switch(type)
        {   
            case ChatActionTypes.SEND_CHATINFO:
            this.sendChatInfo(data)
            break;
            default:
            break;

        }
    }

    gameActionHandler(event, data){
        switch(event)
        {
            case AppEvent.GET_CHATINFO:
            this.receveChatInfo(data);
            break;
        }
    }

    //发送聊天数据
    sendChatInfo(data)
    {   
        logger.info(data)
        let chatProxy = this.getProxy(GameProxy.Chat)
        chatProxy.onTriggerNet140000Req(data)
    }

    receveChatInfo(data)
    {
        this.getAction().getChatInfo(data);
    }

}
ChatModule.NAME = "ChatModule";

export default ChatModule;
