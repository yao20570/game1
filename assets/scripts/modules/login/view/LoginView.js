/**
 * Created by on 2017/9/25.
 */

import BasicView from "BasicView";
import LoginPanel from "LoginPanel";
import ServerListPanel from "ServerListPanel";

export default class LoginView extends BasicView{

    registerPanels(){
        this.registerPanel(LoginPanel.NAME, LoginPanel);
        this.registerPanel(ServerListPanel.NAME, ServerListPanel);
    }

    showDefaultPanel(){
        this.showPanel(LoginPanel.NAME);
    }

}