import BasicView from "BasicView";
import ActivityPanel from "ActivityPanel";
import logger from "Logger";

export default class ActivityView extends BasicView{

    registerPanels(){
        this.registerPanel(ActivityPanel.NAME, ActivityPanel);
    }

    showDefaultPanel(){
        this.showPanel(ActivityPanel.NAME);
    }

}