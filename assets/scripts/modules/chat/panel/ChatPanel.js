/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import AllComponent from "AllComponent"
import worldChatPanel from "worldChatPanel"
import legionChatPanel from "legionChatPanel"

class ChatPanel extends BasicPanel{

    initPanel(){

    }

    afterinitPanel()
    {
        let componentBg = this.createLv1Bg("聊天", null);
        //let url ="resources/bg/battle/103/bg.webp";
        //componentBg.setImageBg(url)

        this._tabControl = AllComponent.getInstantiate("UITabControl")
        this.node.addChild(this._tabControl)
        this._tabControl.getComponent("UITabControl").setParent(this)
        this._tabControl.getComponent("UITabControl").addTabPanel(worldChatPanel.NAME, "世界")
        this._tabControl.getComponent("UITabControl").addTabPanel(legionChatPanel.NAME, "同盟")
        this._tabControl.getComponent("UITabControl").setItemCount(1, 10, true)
    }

    registerEvents(){
    }
    
    ////////////////渲染相关////////////////////////////
    render(){

    }

}

ChatPanel.NAME = "ChatPanel";
export default ChatPanel;