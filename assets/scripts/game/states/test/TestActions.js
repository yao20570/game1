/**
 * Created by on 2017/9/25.
 */

import TestDispatcher from "TestDispatcher";

const Actions = {

    reName: function(name){
        TestDispatcher.dispatch({
            actionType : 'reName',
            name : name
        })
    },
};

export default Actions;