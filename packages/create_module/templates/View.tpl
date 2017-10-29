import BasicView from "BasicView";
import #moduleName#Panel from "#moduleName#Panel";
import logger from "Logger";

export default class #moduleName#View extends BasicView{

    registerPanels(){
        this.registerPanel(#moduleName#Panel.NAME, #moduleName#Panel);
    }

    showDefaultPanel(){
        this.showPanel(#moduleName#Panel.NAME);
    }

}