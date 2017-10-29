/**
 * Created by on 2017/9/25.
 */

import BasicComponent from "BasicComponent";
// import Todo from "Todo";
import TodoActions from "TodoActions";
import TodoStore from "TodoStore";
import FluxContainer from "FluxContainer";

const {ccclass, property} = cc._decorator;
@ccclass
class TodoComponent extends BasicComponent{

    initComponent(){
        this._updateBtn = this.getChildByName("updateBtn");
        this._todoNode = this.getChildByName("todo");
    }

    registerEvents(){
        this.addTouchEventListener(this._updateBtn, () => this.onUpdateBtn());

        FluxContainer.createFunctional(this, TodoStore);

        let TodoActionTypes = require("TodoActionTypes");
        cc.info(TodoActionTypes);

    }

    onUpdateBtn(){

        // TodoActions.editTodo("1", "woko");

        TodoActions.addTodo("woko");

        // cc.info("!!!!!onUpdateBtn!!!!!");
        // let todo = new Todo({
        //     id : "22222",
        //     text: "hahah",
        //     complete: false,
        // });
        // this.setState({todo : todo});
    }

    render(){
        // this.state.getRecord
        let todo = this.state.get("id-1");
        this._renderTodo(this._todoNode, todo);
    }

    _renderTodo(todoNode, todo){
        if(todo == null){
            return;
        }
        let idTxt = todoNode.getChildByName("idTxt");
        let completeBox = todoNode.getChildByName("completeBox");
        let infoTxt = todoNode.getChildByName("infoTxt");

        this.setLabel(idTxt, todo.get("id"));
        this.setLabel(infoTxt, todo.get("text"));
        let toggle = completeBox.getComponent(cc.Toggle);
        toggle.isChecked = todo.get("complete");
    }
}

export default TodoComponent;