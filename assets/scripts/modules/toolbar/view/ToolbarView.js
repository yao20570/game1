import BasicView from "BasicView";
import ToolbarPanel from "ToolbarPanel";
import logger from "Logger";

export default class ToolbarView extends BasicView{

    registerPanels(){
        this.registerPanel(ToolbarPanel.NAME, ToolbarPanel);
    }

    showDefaultPanel(){
        this.showPanel(ToolbarPanel.NAME);
    }

}