import BasicAction from "BasicAction";
import CreateRoleActionTypes from "CreateRoleActionTypes";

export default class CreateRoleAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(CreateRoleActionTypes.SHOW_OTHER_EVENT, data)
    }

    createRole(data){
        this.dispatch(CreateRoleActionTypes.Create_Role, data)
    }
}