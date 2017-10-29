import FluxReduceStore from "FluxReduceStore";
import MapActionTypes from "MapActionTypes";

export default class MapStore extends FluxReduceStore {

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