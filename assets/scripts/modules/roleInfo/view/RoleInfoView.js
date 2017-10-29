import BasicView from "BasicView";
import RoleInfoPanel from "RoleInfoPanel";
import logger from "Logger";

export default class RoleInfoView extends BasicView{

    registerPanels(){
        this.registerPanel(RoleInfoPanel.NAME, RoleInfoPanel);
    }

    showDefaultPanel(){
        this.showPanel(RoleInfoPanel.NAME);
    }

}