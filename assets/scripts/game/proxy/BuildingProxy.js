/**
 * Created by on 2017/9/28.
 */
import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameConfig from "GameConfig";



class BuildingProxy extends BasicProxy {
    constructor() {
        super();

        this.HeartbeatCDKey = "HeartbeatCDKey";
    }

    //重置数据，在切换账号的时候重置调用
    resetAttr() {
    }

    //数据代理全部初始化前调用
    beforeInitSyncData() {
    }

    //数据代理初始化
    initSyncData(data) {
        data = self.afterData
        // BuildingProxy.super.afterInitSyncData(self, data)
        // self:resetAttr()

        // local buildingInfos = data.buildingInfos

        // for _,buildingInfo in pairs(buildingInfos) do
        //     self:_updateBuildingInfo(buildingInfo, true)

        //     if buildingInfo.levelTime > 0 then
        //         self:updateLvUpRemainTime(buildingInfo.buildingType, buildingInfo.index, buildingInfo.levelTime)
        //     end

        //     for _, productionInfo in pairs(buildingInfo.productionInfos) do
        //         self:updateProductRemainTime(buildingInfo.buildingType,
        //             buildingInfo.index, productionInfo.order, productionInfo.remainTime )
        //     end 
        // end

        // ////-将等级为0的建筑，空地数据-由客户端自己实例化////////////////
        // //主城建筑
        // local buildOpenConfig = ConfigDataManager:getConfigData(ConfigData.BuildOpenConfig)
        // for _, info in pairs(buildOpenConfig) do
        //     if info.type == 2 then
        //         break //铸币所跳过
        //     end
        //     local buildingInfo = self:getBuildingInfo(info.type, info.ID)
        //     if buildingInfo ~= nil and buildingInfo.level == 0 then
        //         logger:error("=========建筑等级为0的建筑，服务端不用发了！===:%d=>%d===============", info.type, info.ID)
        //     elseif buildingInfo == nil then //
        //         buildingInfo = self:_createNewBuildingInfo(info.type, info.ID)
        //         self:_updateBuildingInfo(buildingInfo, true)
        //     end
        // end
        // ////-野外建筑
        // //官邸建筑，获取野外建筑的建筑
        // local buildingInfo = self:getBuildingInfo(1, 1) // 官邸的相关等级
        // local rlist = ConfigDataManager:getConfigData(ConfigData.BuildBlankConfig)
        // local openList = {}
        // for _, json in pairs(rlist) do
        //     if buildingInfo.level >= json.openlv then
        //         table.insert(openList, json.ID)
        //     end
        // end
        // for _, id in pairs(openList) do
        //     local fieldInfo = self:getFieldBuildingInfo(id)
        //     if fieldInfo ~= nil and fieldInfo.buildingType == 0 then
        //         logger:error("======空地，服务端不用发了！===:%d=====", id)
        //     elseif fieldInfo == nil then
        //         buildingInfo = self:_createNewBuildingInfo(0, id)
        //         self:_updateBuildingInfo(buildingInfo, true)
        //     end
        // end

        // local autoUpgradeInfo = data.autoUpgradeInfo
        // self:setAutoBuildState(autoUpgradeInfo.type)
        // if autoUpgradeInfo.type == 1 then 
        //     self:updateAutoBuildRemainTime(autoUpgradeInfo.autoRemainTime)
        //     self:_triggerAutoBuild()
        // end
        // self:setAutoBuildRemainTime(autoUpgradeInfo.autoRemainTime)
        this.onTriggerNet280015Req();

        // local soldierProxy = self:getProxy(GameProxys.Soldier)
        // soldierProxy:setMaxFighAndWeight()
    }

    //数据代理全部初始化完后调用
    afterInitSyncData() {
    }

    //每天数据重置调用
    resetCountSyncData(data) {
    }

    //===========================================公用函数===============================================

    //getXXXX(){}
    //setXXX(){}


    //============================================协议===================================================

    // 心跳
    onTriggerNet280015Req() {
        this._startReq280015 = true
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280015, {});
    }
    onTriggerNet280015Resp(data) {
        if (data.rs == 0) {

            let roleProxy = this.getProxy(GameProxy.Role);
            roleProxy.onTriggerNet20002Resp(data, true);

            //服务端有时也会直接推送280015过来，会覆盖掉定时器，导致延后请求，而被处理成没有心跳
            if (this._startReq280015 == true) {
                this._startReq280015 = false;
                
                //通过280015来做心跳判断
                GameConfig.lastHeartbeatTime = new Date();
                GameConfig.serverTime = data.serverTime;

                logger.info("~~~~~~~~~心跳~~~~服务器时间~~~~~:%d~~~~~~~~", GameConfig.serverTime)

                this.pushRemainTime(this.HeartbeatCDKey, 60, AppEvent.NET_M28_C280015, null, this.onTriggerNet280015Req);
            }

        }


    }


    // 建筑升级，建筑请求
    onTriggerNet280001Req(data){
        let index = data.index;
        let type = data.type;
        // let buildingType = data.buildingType;
        let buildingType = type;  //TODO
        
        let sendData = {};
        let buildingShortInfos = [];
        buildingShortInfos.push({ 'buildingType': buildingType, 'index': index });
        
        sendData.buildingShortInfos = buildingShortInfos;
        sendData.type = 1;       
        
        logger.info("**请求建筑升级280001**", sendData);
        this.syncNetReq(AppEvent.NET_M28,AppEvent.NET_M28_C280001,sendData);
    }
    onTriggerNet280001Resp(data){
        logger.info("**280001**", data);
        if (data.rs == 0) {
            
        }
    }
    
    // 建筑完成升级返回
    // onTriggerNet280002Req() {
    //     this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280002, {});
    // }    
    onTriggerNet280002Resp(data){
        logger.info("**280002**", data);
        if (data.rs == 0) {

        }
    }

    // 取消建筑升级
    onTriggerNet280003Req(data) {
        let sendData = {};
        sendData.index = data.index;
        sendData.buildingType = data.type;

        logger.info("**请求取消建筑升级280003**", sendData);
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280003, sendData);
    }    
    onTriggerNet280003Resp(data){
        logger.info("**280003**", data);
        if (data.rs == 0) {
            
        }
    }

    // 建筑加速升级
    onTriggerNet280004Req(data) {
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280004, {});
    }    
    onTriggerNet280004Resp(data){
        if (data.rs == 0) {
            
        }
    }

    // 拆除野外建筑
    onTriggerNet280005Req(data) {
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280005, {});
    }    
    onTriggerNet280005Resp(data){
        if (data.rs == 0) {
            
        }
    }

    // 请求建筑生产
    onTriggerNet280006Req(data) {
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280006, {});
    }
    onTriggerNet280006Resp(data) {
        if (data.rs == 0) {
            
        }
    }
    
    // 请求生产完成
    onTriggerNet280007Req(data) {
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280007, {});
    }
    onTriggerNet280007Resp(data){
        if (data.rs == 0) {
            
        }
    }
    
    // 取消生成返回
    onTriggerNet280008Req(data) {
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280008, {});
    }
    onTriggerNet280008Resp(data){
        if (data.rs == 0) {
            
        }
    }
    
    // 加速生成返回
    onTriggerNet280009Req(data) {
        this.syncNetReq(AppEvent.NET_M28, AppEvent.NET_M28_C280009, {});
    }
    onTriggerNet280009Resp(data){
        if (data.rs == 0) {
            
        }
    }

}

export default BuildingProxy;