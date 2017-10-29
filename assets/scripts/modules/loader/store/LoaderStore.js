/**
 * Created by on 2017/10/13
 */

import FluxReduceStore from "FluxReduceStore";
import LoaderActionTypes from "LoaderActionTypes";


export default class LoaderStore extends FluxReduceStore {
    //定义数据结构了
    getInitialState(){
        return Immutable.fromJS({
            curProgress: 0,
        });

    };

    //传入action
    reduce(state, action) {
        switch (action.type){
            case LoaderActionTypes.SET_PROGRESS:
                return state.set("curProgress", action.data);
            default:
                return state;
        }
    }



}
