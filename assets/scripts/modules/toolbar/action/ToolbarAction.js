import BasicAction from "BasicAction";
import ToolbarActionTypes from "ToolbarActionTypes";

export default class ToolbarAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(ToolbarActionTypes.SHOW_OTHER_EVENT, data)
    }

    hideOtherHandler(data){
        this.dispatch(ToolbarActionTypes.HIDE_OTHER_EVENT, data)
    }

    loadComplete(){
        this.dispatch(ToolbarActionTypes.LOAD_COMPLETE, null)
    }
}