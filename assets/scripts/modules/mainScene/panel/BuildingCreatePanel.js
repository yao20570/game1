/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import AllComponent from "AllComponent";
import logger from "Logger";
import StringUtils from "StringUtils";

class BuildingCreatePanel extends BasicPanel{
    
    //panel的初始化，还没能调用action
    initPanel(){
        logger.info("*******显示BuildingCreatePanel*******");
        this.createLv1Bg("创建", null, () => this.onBackToBtn());                
        
        this.topPanel = this.getChildByName("topPanel");
        this.downPanel = this.getChildByName("downPanel");
        this.needScrollView = this.getChildByName("needScrollView");
        this.buildingIcon = this.topPanel.getChildByName("buildingIcon");
        this.buildingBtn = this.downPanel.getChildByName("buildingBtn");
        this.cancelBtn = this.downPanel.getChildByName("cancelBtn");
    }
    
    //panel的节点事件注册
    registerEvents(){
        this.addTouchEventListener(this.buildingBtn, (sender) => this.onBuildingUpgrateTouch(sender));
        this.addTouchEventListener(this.cancelBtn, (sender) => this.onCancelUpgrateTouch(sender));
    }

    // 点击建筑升级
    onBuildingUpgrateTouch(sender) {
        let buildingInfo = sender.target.buildingInfo;
        logger.info("点击建筑升级~~~~~", buildingInfo);
        this.getAction().onBuildingUpgrateReq(buildingInfo);
    }

    // 点击取消建筑升级
    onCancelUpgrateTouch(sender) {
        let buildingInfo = sender.target.buildingInfo;
        logger.info("取消建筑升级~~~~~", buildingInfo);
        this.getAction().onBuildingUpgrateRev(buildingInfo);
    }

    //panel的初始化后，可能调用action了
    afterinitPanel(){
    }

    //打开面板
    onShowHandle(){
    }

    onBackToBtn(){
        logger.info("*******隐藏BuildingCreatePanel*******");
        this.hidePanel(BuildingCreatePanel.NAME);
    }
    //关闭面板
    onHideHandle(){
    }


    ////////////////渲染相关////////////////////////////
    render(){
        let buildingInfo = this.state.get("buildingInfo");
        this.buildingBtn.buildingInfo = buildingInfo;
        this.cancelBtn.buildingInfo = buildingInfo;
        
        logger.info("建造数据：",buildingInfo);
        logger.info(this.buildingIcon);
        
        let name = this.topPanel.getChildByName("name");
        let config = buildingInfo[0];
        let nameStr = StringUtils.format("Lv.{0} {1}", config.initlevel, config.name);
        this.setLabel(name, nameStr);


        this.buildingIcon.scale = cc.p(0.5,0.5);
        

    }

}

BuildingCreatePanel.NAME = "BuildingCreatePanel";
export default BuildingCreatePanel;


