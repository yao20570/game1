/**
 * Created by on 2017/9/25.
 */
import FluxStore from "FluxStore";
export default class FluxReduceStore extends FluxStore{

    constructor(dispatcher){
        super(dispatcher);
        this._state = this.getInitialState();
    }

    getState(){
        return this._state;
    }

    getInitialState(){

    }

    reduce(state, action){

    }

    areEqual(one, two){
        return one === two;
    }

    __invokeOnDispatch(action){
        this.__changed = false;

        const startingState = this._state;
        const endingState = this.reduce(startingState, action);

        if (!this.areEqual(startingState, endingState)) {
            this._state = endingState;

            // `__emitChange()` sets `this.__changed` to true and then the actual
            // change will be fired from the emitter at the end of the dispatch, this
            // is required in order to support methods like `hasChanged()`
            this.__emitChange();
        }

        if (this.__changed) {
            this.__emitter.emit(this.__changeEvent, endingState);
        }
    }
}