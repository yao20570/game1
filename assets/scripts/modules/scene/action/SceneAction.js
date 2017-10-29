import BasicAction from "BasicAction";
import SceneActionTypes from "SceneActionTypes";

export default class SceneAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(SceneActionTypes.SHOW_OTHER_EVENT, data)
    }

    hideSelfHandler(data){
        this.dispatch(SceneActionTypes.HIDE_SELF_EVENT, data)
    }
}