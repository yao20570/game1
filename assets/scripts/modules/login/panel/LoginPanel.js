/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import ServerListPanel from "ServerListPanel";

class LoginPanel extends BasicPanel{

    initPanel(){
        this._server = null;
        this._enterBtn = this.getChildByName("enterBtn");
        this._serverTxt = this.getChildByName("serverTxt");
        this._stateTxt = this.getChildByName("stateTxt");
        this._infoImg = this.getChildByName("infoImg");
        this._accountInput =  this.getChildByName("accountInput");
        this._editBox = this._accountInput.getComponent(cc.EditBox);
    }

    registerEvents(){
        this.addTouchEventListener(this._infoImg, () => this.onShowServerListPanel());
        this.addTouchEventListener(this._enterBtn, () => this.onEnterGameBtn());
    }

    onShowServerListPanel(){
        logger.info("!!!!!!!!!onShowServerListPanel!!!!!!!!!!!!!");
        this.showPanel(ServerListPanel.NAME);
    }

    onEnterGameBtn(){
        logger.info("!!!!!!!!!onEnterGameBtn!!!!!!!!!!!!!");
        let selectServer = this.state.get("selectServer");

        let playerAccount = this._editBox.string;

        this.getAction().enterGame({server : selectServer, accountName : playerAccount});
    }

    onShowHandle(){
        this.getAction().closeLoaderModule();
    }

    onHideHandle(){

    }

    ////////////////渲染相关////////////////////////////
    render(){
        let selectServer = this.state.get("selectServer");
        //let serverList = this.state.get("serverList");
        // logger.info(selectServer);
        this._renderSelectServer(selectServer);
    }

    _renderSelectServer(selectServer){
        if(selectServer == null){
            return;
        }
        let serverName = selectServer.name;
        this.setLabel(this._serverTxt, serverName);

        //设置默认的帐号显示
        let playerAccount = this.state.get("playerAccount");
        if (playerAccount != null && this._editBox.string == "") {
            this._editBox.string = playerAccount;
        }
        //默认服务器
    }

}

LoginPanel.NAME = "LoginPanel";
export default LoginPanel;