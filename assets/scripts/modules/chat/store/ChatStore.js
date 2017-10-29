import FluxReduceStore from "FluxReduceStore";
import ChatActionTypes from "ChatActionTypes";

export default class ChatStore extends FluxReduceStore {

    // 模块数据结构定义的地方
    getInitialState() {
        return Immutable.fromJS({
            worldChatList: []                   //接收到的聊天数据  数组
            
        });
    }

    reduce(state, action) {
        switch (action.type) {
            case ChatActionTypes.GET_CHATINFO:
            return this.getChatInfo(state,action.data);
            break;
            case ChatActionTypes.SENDCHATINFO:

            break;
            default:
                return state;
        }
    }
    getChatInfo(state,info)
    {
        //
        let worldChatList = [];             //发送给面板的数据
        if(info.type == 1)                  //世界聊天面板
        {
            let chats = info.chats;
           for (let i=0;i<chats.length;i++)
           {
               let chatInfo ={context:chats[i].context,name:chats[i].name}
                worldChatList.push(chatInfo)
           }
            return  state.set("worldChatList",worldChatList);
            //return worldState;
        }
        else if (info.type == 2 )           //同盟聊天面板
        {
            //同盟的还没做
        }
        else if (info.type == 3 )           //私聊面板
        {
            //私聊的也不做
        }

    }
}