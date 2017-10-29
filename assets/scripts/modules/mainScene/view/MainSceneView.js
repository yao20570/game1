import BasicView from "BasicView";
import MainScenePanel from "MainScenePanel";
import BuildingCreatePanel from "BuildingCreatePanel";
import BuildingUpgratePanel from "BuildingUpgratePanel";
import logger from "Logger";
import GameLayerName from "GameLayerName";

export default class MainSceneView extends BasicView{

    initView() {
        this._panelLayerMap["BuildingCreatePanel"] = GameLayerName.uiTopLayer;
    }

    registerPanels(){
        this.registerPanel(MainScenePanel.NAME, MainScenePanel);
        this.registerPanel(BuildingCreatePanel.NAME, BuildingCreatePanel);
        this.registerPanel(BuildingUpgratePanel.NAME, BuildingUpgratePanel);
    }

    showDefaultPanel(){
        this.showPanel(MainScenePanel.NAME);
    }

}