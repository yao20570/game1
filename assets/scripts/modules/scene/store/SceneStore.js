import FluxReduceStore from "FluxReduceStore";
import SceneActionTypes from "SceneActionTypes";

export default class SceneStore extends FluxReduceStore {

    getInitialState() {
        return Immutable.fromJS({
        });
    }

    reduce(state, action) {
        switch (action.type) {
            default:
                return state;
        }
    }
}