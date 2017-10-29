import BasicView from "BasicView";
import ChatPanel from "ChatPanel";
import worldChatPanel from "worldChatPanel";
import legionChatPanel from "legionChatPanel"
import logger from "Logger";

export default class ChatView extends BasicView{

    registerPanels(){
        this.registerPanel(ChatPanel.NAME, ChatPanel);
        this.registerPanel(worldChatPanel.NAME,worldChatPanel)
        this.registerPanel(legionChatPanel.NAME,legionChatPanel)
    }

    showDefaultPanel(){
        this.showPanel(ChatPanel.NAME);
    }

}