import BasicAction from "BasicAction";
import ChatActionTypes from "ChatActionTypes";

export default class ChatAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(ChatActionTypes.SHOW_OTHER_EVENT, data)
    }

    getChatMessage(info)
    {
        this.dispatch(ChatActionTypes.GET_CHATMESSAGE_LIST,info)
    }

    getChatInfo(data)
    {
        this.dispatch(ChatActionTypes.GET_CHATINFO,data)
    }

    sendChatInfo(data)
    {   
        this.dispatch(ChatActionTypes.SEND_CHATINFO,data)
    }
}