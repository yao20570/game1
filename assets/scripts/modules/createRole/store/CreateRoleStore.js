import FluxReduceStore from "FluxReduceStore";
import CreateRoleActionTypes from "CreateRoleActionTypes";

export default class CreateRoleStore extends FluxReduceStore {

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