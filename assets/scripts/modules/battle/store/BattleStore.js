import FluxReduceStore from "FluxReduceStore";
import BattleActionTypes from "BattleActionTypes";

export default class BattleStore extends FluxReduceStore {

    getInitialState() {
        return Immutable.fromJS({
            battleData: null,
            round:0,
        });
    }

    reduce(state, action) {
        switch (action.type) {
            case BattleActionTypes.START_BATTLE:
                state = state.set("battleData", action.data)
                break;   
            case BattleActionTypes.SET_ROUND_NUM:
                state = state.set("round", action.data)
                break;

        }
        return state
    }


}