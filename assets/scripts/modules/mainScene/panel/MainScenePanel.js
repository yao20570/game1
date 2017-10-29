/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import ConfigDataManager from "ConfigDataManager";
import ConfigName from "ConfigName";
import BuildingCreatePanel from "BuildingCreatePanel";
import BuildingUpgratePanel from "BuildingUpgratePanel";


class MainScenePanel extends BasicPanel{

    initPanel(){
        this.sceneScrollView = this.getChildByName("sceneScrollView");
        this.scenePanel = this.getChildByName("sceneScrollView/view/scenePanel");
        this.sceneMap = this.getChildByName("sceneScrollView/view/scenePanel/sceneMap");
        this.buildingMap = this.getChildByName("sceneScrollView/view/scenePanel/buildingMap");
        this._buildingPanel = this.getChildByName("buildingPanel");
        this._buildingPanel.active  = false;

        this._buildingPanelMap = {};
    }

    // 测试数据
    testData(){

    }

    afterInitPanel(){        
        this.getAction().loadComplete()
    }
    
    registerEvents() {
    }

    _registerBuildingEvents(buildingPanel){
        this.addTouchEventListener(buildingPanel, (sender) => this.onBuildingTouch(sender));
    }

    // 点击建筑
    onBuildingTouch(sender){
        let buildingInfo = sender.target.buildingInfo;
        let buildingType = buildingInfo.buildingType;
        let buildingIndex = buildingInfo.buildingIndex;
        logger.info("点击建筑~~~~~", buildingIndex,buildingType);

        this.getAction().onBuildingTouch(buildingInfo);

        this.onBuildingCreatePanel();
    }


    
    // 打开创建建筑面板
    onBuildingCreatePanel() {
        logger.info("!!!!!!!!!BuildingCreatePanel!!!!!!!!!!!!!");
        this.showPanel(BuildingCreatePanel.NAME);
    }

    
    /**
     * 初始化全部建筑：遍历scrollview/buildingMap的全部子节点，并渲染显示。
     * 
     * @memberof MainScenePanel
     */
    initAllBuilding() {
        let children = this.buildingMap.children;
        for (var index = 0; index < children.length; index++) {
            logger.info("child node:",children[index]);
            var child = children[index];
            this.initSceneBuilding(child);
        }
    }

    /**
     * 初始化城内的全部建筑：创建、渲染。
     * 
     * @param {node} buildingPanel buildingMap的子节点
     * @memberof MainScenePanel
     */
    initSceneBuilding(buildingPanel){
        let nodeName = buildingPanel.name;
        nodeName = nodeName.replace("building","");
        let splitArray = nodeName.split("_");
        let buildingType = splitArray[1];
        let buildingIndex = splitArray[2];
        let buildKey = buildingIndex + '_' + buildingType;

        logger.info("node name and split array :",nodeName,splitArray);

        let buildingInfo = ConfigDataManager.getByList(ConfigName.BuildOpenConfig, "ID", buildingIndex, "type", buildingType);
        buildingInfo.buildingIndex = buildingIndex;
        buildingInfo.buildingType = buildingType;

        logger.info(buildingInfo);

        if (buildingPanel) {
            let newBuilidngPanel = this.createBuilding(buildingPanel, buildingIndex, buildingType);
            newBuilidngPanel.buildingInfo = buildingInfo;
            this.renderBuildingPanel(buildingPanel, buildingInfo);

        } else {
            logger.info("建筑节点不存在：", buildKey);
        }
        
    }

    /**
     * 创建一个建筑
     * 
     * @param {node} buildingPanel buildingMap下的节点
     * @param {int} buildingIndex 建筑索引，等价配表ID
     * @param {int} buildingType 建筑类型，等价配表type
     * @returns newBuilidngPanel 返回一个建筑panel
     * @memberof MainScenePanel
     */
    createBuilding(buildingPanel, buildingIndex, buildingType) {
        let buildKey = buildingIndex + '_' + buildingType;
        let newBuilidngPanel = this._buildingPanelMap[buildKey];
        if (newBuilidngPanel == null) {
            newBuilidngPanel = cc.instantiate(this._buildingPanel);
            buildingPanel.addChild(newBuilidngPanel);
            this._buildingPanelMap[buildKey] = newBuilidngPanel;
            // this._registerBuildingEvents(buildingPanel);
        }
        return newBuilidngPanel;
    }

    /**
     * 渲染一个建筑
     * 
     * @param {node} buildingPanel 建筑panel
     * @param {any} buildingInfo 建筑数据
     * @memberof MainScenePanel
     */
    renderBuildingPanel(buildingPanel, buildingInfo) {
        logger.info("渲染建筑：", buildingInfo.buildingIndex, buildingInfo.buildingType);
        buildingPanel.active = true;
        
        let childPanel = buildingPanel.getChildByName("buildingPanel");
        let name = childPanel.getChildByName("name");
        childPanel.active = true;
        
        let config = buildingInfo[0];
        let nameStr = config.initlevel + config.name;
        this.setLabel(name,nameStr);

        // 加载 SpriteFrame
        let url = "resources/images/mainScene/building_" + buildingInfo.buildingType + ".png";
        logger.info("建筑图片URL：", url);
        this.setSprite(childPanel, url);
       
        childPanel.buildingInfo = buildingInfo;
        this._registerBuildingEvents(childPanel);
    }

    // 更新建筑
    updateBuildingPanel(){

    }

    ////////////////渲染相关////////////////////////////
    render(){
        
        this.initAllBuilding();

    }



}

MainScenePanel.NAME = "MainScenePanel";
export default MainScenePanel;

