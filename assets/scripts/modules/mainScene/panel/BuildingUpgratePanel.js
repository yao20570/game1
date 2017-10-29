/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import AllComponent from "AllComponent";
import logger from "Logger";

class BuildingUpgratePanel extends BasicPanel{

    //panel的初始化，还没能调用action
    initPanel(){
    }

    //panel的节点事件注册
    registerEvents(){
    }

    //panel的初始化后，可能调用action了
    afterinitPanel(){        
    }

    //打开面板
    onShowHandle(){
    }

    //关闭面板
    onHideHandle(){
    }

    ////////////////渲染相关////////////////////////////
    render(){

    }

}

BuildingUpgratePanel.NAME = "BuildingUpgratePanel";
export default BuildingUpgratePanel;