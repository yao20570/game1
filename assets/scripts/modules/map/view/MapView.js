import BasicView from "BasicView";
import MapPanel from "MapPanel";
import MapInfoPanel from "MapInfoPanel";
import logger from "Logger";

export default class MapView extends BasicView{

    registerPanels(){
        this.registerPanel(MapPanel.NAME, MapPanel);
        this.registerPanel(MapInfoPanel.NAME, MapInfoPanel);
    }

    showDefaultPanel(){
        this.showPanel(MapPanel.NAME);
        this.showPanel(MapInfoPanel.NAME);
    }

}