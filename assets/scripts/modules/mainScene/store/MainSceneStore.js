import FluxReduceStore from "FluxReduceStore";
import MainSceneActionTypes from "MainSceneActionTypes";

export default class MainSceneStore extends FluxReduceStore {

    getInitialState() {
        return Immutable.fromJS({
        });
    }

    reduce(state, action) {
        switch (action.type) {
            case MainSceneActionTypes.BUILDING_TOUCH:
                return state.set("buildingInfo", action.data);
            default:
                return state;
        }
    }
}