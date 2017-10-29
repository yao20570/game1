import BasicView from "BasicView";
import CreateRolePanel from "CreateRolePanel";
import logger from "Logger";

export default class CreateRoleView extends BasicView{

    registerPanels(){
        this.registerPanel(CreateRolePanel.NAME, CreateRolePanel);
    }

    showDefaultPanel(){
        this.showPanel(CreateRolePanel.NAME);
    }

}