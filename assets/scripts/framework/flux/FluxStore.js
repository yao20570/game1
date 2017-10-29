/**
 * Created by on 2017/9/25.
 */

import EventEmitter from "EventEmitter";

export default class FluxStore{
    // private
    _dispatchToken;

    // protected, available to subclasses
    __changed;
    __changeEvent;
    __className;
    __dispatcher;
    __emitter;

    constructor(dispatcher){
        this.__className = this.constructor.name;

        this.__changed = false;
        this.__changeEvent = 'change';
        this.__dispatcher = dispatcher;
        this.__emitter = new EventEmitter();
        this._dispatchToken = dispatcher.register((payload) => {
            this.__invokeOnDispatch(payload);
        });
    }

    addListener(callback){
        return this.__emitter.addListener(this.__changeEvent, callback);
    }

    getDispatcher(){
        return this.__dispatcher;
    }

    getDispatchToken(){
        return this._dispatchToken;
    }

    hasChanged(){
        return this.__changed;
    }

    __emitChange(){
        this.__changed = true;
    }

    __invokeOnDispatch(payload){
        this.__changed = false;
        this.__onDispatch(payload);
        if (this.__changed) {
            this.__emitter.emit(this.__changeEvent);
        }
    }

    __onDispatch(){

    }
}




