import FluxReduceStore from "FluxReduceStore";
import ActivityActionTypes from "ActivityActionTypes";

export default class ActivityStore extends FluxReduceStore {

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