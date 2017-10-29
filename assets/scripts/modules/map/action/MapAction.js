import BasicAction from "BasicAction";
import MapActionTypes from "MapActionTypes";

export default class MapAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(MapActionTypes.SHOW_OTHER_EVENT, data)
    }
}