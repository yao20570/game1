import BasicView from "BasicView";
import ScenePanel from "ScenePanel";
import logger from "Logger";

export default class SceneView extends BasicView{

    registerPanels(){
        this.registerPanel(ScenePanel.NAME, ScenePanel);
    }

    showDefaultPanel(){
        this.showPanel(ScenePanel.NAME);
    }

}