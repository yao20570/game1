/**
 * Created by on 2017/9/25.
 */

import TestStore from "TestStore";

class TestDispatcher{

    constructor(){
        this._funcList = [];
    }

    register(func){
        this._funcList.push(func);
    }

    dispatch(data){
        this._funcList.forEach((func) => func.call(this, data));
    }


}

let dispatch = new TestDispatcher();
dispatch.register((action) => {  //dispatch
    switch (action.actionType){
        case 'reName':
            TestStore.resetName(action.name);
            TestStore.emitChange();
            break;
    }
});

export default dispatch;