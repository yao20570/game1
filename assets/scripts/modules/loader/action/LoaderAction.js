/**
 * Created by on 2017/10/13.
 */
import BasicAction from "BasicAction";
import LoaderActionTypes from "LoaderActionTypes";

export default class LoaderAction extends BasicAction{

    loaderStart(){
        this.dispatch(LoaderActionTypes.LOADER_START)
    }

    setProgress(info){
        this.dispatch(LoaderActionTypes.SET_PROGRESS, info)
    }

}