/**
 * Created by on 2017/9/26.
 */
import BasicPanel from "BasicPanel";
import AllComponent from "AllComponent";
import logger from "Logger";

class ServerListPanel extends BasicPanel{

    initPanel(){
        // logger.info(AllComponent.uiSecLvPanel)
        //let node = AllComponent.getInstantiate("UITab");
        //this.node.addChild(node);
        //this.initUIFirst("服务器信息",null)
        this.createLv2Bg("服务器信息",550,700,()=>this.onCloseBtn(),null);
        this._scrollView = this.getChildByName("scrollView");
        this._serverPanel = this.getChildByName("scrollView/view/serverPanel"); //this._scrollView.content; //this.getChildByName("serverPanel");
        this._infoPanel = this.getChildByName("infoPanel");// this.getChildByName("serverPanel/infoPanel");
        this._addServerPanelEvent(this._infoPanel);

        this._infoPanelList = [];
        this._infoPanelList.push(this._infoPanel);
        this._infoPanelMap = {};
    }

    onHelpBtn()
    {
        logger.info(" 这是给二级面板注册的回调函数 帮助")
    }
    onCloseBtn()
    {
        logger.info("这是给二级面板注册的回调函数  关闭")
        this.hidePanel(ServerListPanel.NAME);
    }
    _addServerPanelEvent(serverPanel){
        this.addTouchEventListener(serverPanel, (sender) => this._onSelectServerPanel(sender))
    }

    _onSelectServerPanel(sender){

        this.hidePanel(ServerListPanel.NAME);
        let target = sender.target;
        let server = target.server;
        logger.info("~~~~~_onSelectServerPanel~~~~~~~~", server);
        this.getAction().selectServer(server);
    }

    render(){
        let serverList = this.state.get("serverList");
        let selectServer = this.state.get("selectServer");
        logger.info("所有的服"+serverList);
        serverList.forEach(server => {
            let serverId = server.serverId;
            let infoPanel = this._infoPanelMap[serverId]; //this._infoPanelList.pop();
            if(infoPanel == null){
                infoPanel = cc.instantiate(this._infoPanel);
                this._infoPanelMap[serverId] = infoPanel;
                this._serverPanel.addChild(infoPanel);
                this._addServerPanelEvent(infoPanel);
            }
            this._renderInfoPanel(infoPanel, server, selectServer.serverId);
        })
    }

    _renderInfoPanel(infoPanel, server, selectServerId){
        infoPanel.active = true;
        infoPanel.server = server;
        let nameTxt = infoPanel.getChildByName("nameTxt");
        let stateTxt = infoPanel.getChildByName("stateTxt");
        let normalImg = infoPanel.getChildByName("normalImg");
        let selectImg = infoPanel.getChildByName("selectImg");
        this.setLabel(nameTxt, server.name);
        let serverId = server.serverId;
        if(serverId == selectServerId){
            normalImg.active = false;
            selectImg.active = true;
        }else {
            normalImg.active = true;
            selectImg.active = false;
        }

    }
}

ServerListPanel.NAME = "ServerListPanel";
export default ServerListPanel;