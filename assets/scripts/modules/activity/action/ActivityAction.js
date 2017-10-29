import BasicAction from "BasicAction";
import ActivityActionTypes from "ActivityActionTypes";

export default class ActivityAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(ActivityActionTypes.SHOW_OTHER_EVENT, data)
    }
}