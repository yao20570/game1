import BasicAction from "BasicAction";
import MainSceneActionTypes from "MainSceneActionTypes";

export default class MainSceneAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(MainSceneActionTypes.SHOW_OTHER_EVENT, data);
    }

    loadComplete(){
        this.dispatch(ToolbarActionTypes.LOAD_COMPLETE, null);
    }

    onBuildingTouch(data){
        this.dispatch(MainSceneActionTypes.BUILDING_TOUCH, data);
    }

    onBuildingUpgrateReq(data){
        this.dispatch(MainSceneActionTypes.BUILDING_UPGRATE_REQ, data);
    }

    onBuildingUpgrateRev(data){
        this.dispatch(MainSceneActionTypes.BUILDING_UPGRATE_REV, data);
    }

    onBuildingUpgrateQuick(data){
        this.dispatch(MainSceneActionTypes.BUILDING_UPGRATE_QUICK, data);
    }

    onBuildingProductQuick(data){
        this.dispatch(MainSceneActionTypes.BUILDING_PRODUCT_QUICK, data);
    }

    onBuildingRemoveField(data){
        this.dispatch(MainSceneActionTypes.BUILDING_REMOVE_FIELD, data);
    }

    onBuildingProductReq(data){
        this.dispatch(MainSceneActionTypes.BUILDING_PRODUCT_REQ, data);
    }
    
    onBuildingProductRev(data){
        this.dispatch(MainSceneActionTypes.BUILDING_PRODUCT_REV, data);
    }

}