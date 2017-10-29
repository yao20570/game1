/**
 * Created by on 2017/9/20.
 */

import BasicComponent from "BasicComponent";
import TestStore from "TestStore";
import TestActions from "TestActions";
import TestDispatcher from "TestDispatcher";
const {ccclass, property} = cc._decorator;
@ccclass
class TestComponent extends BasicComponent{
    @property(cc.Label)
    label2 = {};

    @property(cc.Button)
    button = {};

    constructor(){
        super();
        this.state = {name : "woko"};
        this._index = 1;
    }
    //
    // test(){
    //     super.getDefaultProps();
    // }

    registerEvents(){
        cc.info(this.button, "!!!!");

        this.addTouchEventListener(this.button.node, () => this.onClickButton());
        TestStore.addChangeListener(() => this._onChange());
    }

    onClickButton(){
        cc.info("!!!!!!onClickButton!!!!!!!!");
        TestActions.reName("woko2" + (this._index++));
    }

    _onChange(){
        cc.info("!!!!!!_onChange!!!!!!!!" + (this._index++));
        this.setState({name : TestStore.getName()});
    }


    render(){
        this.label2.string = this.state.name;
    }
}

export default TestComponent;