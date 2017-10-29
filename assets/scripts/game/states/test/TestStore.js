/**
 * Created by on 2017/9/25.
 */

import EventEmitter from "EventEmitter";

class TestStore extends EventEmitter{

    constructor(){
        super();
        this._name = "init";
    }

    getName(){
        return this._name;
    }

    resetName(name){
        this._name = name;
    }

    emitChange(){
        this.emit('change');
    }

    addChangeListener(callback){
        this.on('change', callback);
    }


}

export default new TestStore();