import FluxReduceStore from "FluxReduceStore";
import ToolbarActionTypes from "ToolbarActionTypes";

export default class ToolbarStore extends FluxReduceStore {

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