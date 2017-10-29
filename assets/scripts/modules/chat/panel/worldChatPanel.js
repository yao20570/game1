import BasicPanel from "BasicPanel";
import logger from "Logger";
import AllComponent from "AllComponent"

class worldChatPanel extends BasicPanel{

    initPanel(){
        logger.info("初始化 initPanel")
    }

    registerEvents(){
    }
    
    ////////////////渲染相关////////////////////////////
    render(){
        let worldChatList =this.state.get("worldChatList");
        logger.info("更新数据了 "+worldChatList);
        for (let i=0;i<worldChatList.length;i++)
        {
            let chatInfoUI = cc.instantiate(this._item);
            chatInfoUI.active = true;
            chatInfoUI.x = -300;
            //chatInfoUI.getComponent(cc.Label).string = worldChatList[i].name+" 说:"+worldChatList[i].context;
            let sprite = chatInfoUI.getChildByName("sprite")

            let label = chatInfoUI.getChildByName("label")
            label.getComponent(cc.Label).string = worldChatList[i].name +" 说 :" +worldChatList[i].context;

            sprite.height =label.height;
            sprite.width = label.width;
            chatInfoUI.width = label.width+60;



            this._content.addChild(chatInfoUI);
        }

        let y = this._content.height;
        if (y> 700)
        {
            this._scrollview.getComponent(cc.ScrollView).scrollToBottom(2); 
        }

    }

    afterinitPanel()
    {
        logger.info(" 初始化 afterinitpanel");
        this._item = this.getChildByName("item");
        this._scrollview = this.getChildByName("scrollview");
        this._content = this.getChildByName("scrollview/view/content");
        this._sendEdt = this.getChildByName("downPanel/sendEdt");
        this._sendBtn = this.getChildByName("downPanel/sendBtn");

        this.addTouchEventListener(this._sendBtn,(sender)=>this.onTouchSendBtn(sender));

        
    }

    onTouchSendBtn(sender) 
    {
        
        // for (let i = 0; i < 10; i++) {
        //     let chatInfoUI = cc.instantiate(this._item);
        //     chatInfoUI.active = true;
        //     chatInfoUI.x = -300;
        //     chatInfoUI.getComponent(cc.Label).string = "这是测试的数据" + i;
        //     this._content.addChild(chatInfoUI);
        // }

        // let y = this._content.height;
        // if (y> 700)
        // {
        //     this._scrollview.getComponent(cc.ScrollView).scrollToBottom(2); 
        // }
    
        // logger.info(y);
        let data ={}
        data.type = 1;
        data.context = this._sendEdt.getComponent(cc.EditBox).string;
        data.contextType = 1;
        data.chatClientId = null;
        data.audioSec = null;

        this.getAction().sendChatInfo(data);
        logger.info("点击了 发送 按钮")

        this._sendEdt.getComponent(cc.EditBox).string = " ";

        this.showMessage("老铁~ 得劲不？");



    }


    //具体在UI上的表现
    renderChatInfo(item,element)
    {

    }
}

worldChatPanel.NAME = "worldChatPanel";
export default worldChatPanel;