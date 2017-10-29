import BasicView from "BasicView";
import BattlePanel from "BattlePanel";
import logger from "Logger";

export default class BattleView extends BasicView{

    registerPanels(){
        this.registerPanel(BattlePanel.NAME, BattlePanel);
    }

    showDefaultPanel(){
        this.showPanel(BattlePanel.NAME);
    }

}