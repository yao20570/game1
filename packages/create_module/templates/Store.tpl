import FluxReduceStore from "FluxReduceStore";
import #moduleName#ActionTypes from "#moduleName#ActionTypes";

export default class #moduleName#Store extends FluxReduceStore {

    getInitialState() {
        return Immutable.fromJS({
        });
    }

    reduce(state, action) {
        switch (action.type) {
                
        }
        return state;
    }
}