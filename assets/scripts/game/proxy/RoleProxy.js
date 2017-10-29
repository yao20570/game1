/**
 * Created by on 2017/9/28.
 */
import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";
import ConfigDataManager from "ConfigDataManager";
import ConfigName from "ConfigName";
import GameConfig from "GameConfig";

class RoleProxy extends BasicProxy {
    constructor() {
        super();

        this._serverOpenTime = 0;
        this._isInitInfo = false;

        this._actorInfo = null;
        this._name = "";
    }

    //重置数据，在切换账号的时候重置调用
    resetAttr() {
    }

    //数据代理全部初始化前调用
    beforeInitSyncData() {
    }

    initSyncData(data) {
        this._serverOpenTime = data.openServerTime;

        // TODO:播放队列重置
        //EffectQueueManager.reconnectInit()

        this._isInitInfo = true;

        this._actorInfo = data.actorInfo;
        let actorInfo = data.actorInfo;

        this.setRoleAttrInfos(actorInfo.attrInfos);


        // if (data.chargeDoubleList) {
        //     this.setChargeDoubleList(data.chargeDoubleList);
        //     this.sendNotification(AppEvent.PROXY_UPDATE_RECHARGE_INFO, {}); //推送已双倍充值的额度
        // }

        // if (data.cityBattleReward) {
        //     logger.info("城主战 小红点！~~~%d", data.cityBattleReward);
        //     let redPointProxy = this.getProxy(GameProxys.RedPoint);
        //     redPointProxy.updateCityBattleRedNum(data.cityBattleReward);
        // }

        // if (actorInfo.fameState) {
        //     this.setPrestigeState(actorInfo.fameState);
        // }
        // if (actorInfo.engryprice) {
        //     this.setEnergyNeedMoney(actorInfo.engryprice);
        // }
        // this.setCrusadeEnergyNeedMoney(actorInfo.crusadeEnergyPrice);
        // if (actorInfo.boomRefTime) {

        //     this.setBoomRemainTime(actorInfo.boomRefTime);
        // }
        // if (actorInfo.energyRefTime) {

        //     this.setEnergyRemainTime(actorInfo.energyRefTime);
        // }
        // this.setCrusadeEnergyRemainTime(actorInfo.crusadeEnergyTime);
        // if (actorInfo.tanbaoFrees) {
        //     let pubProxy = this.getProxy(GameProxys.Pub);
        //     pubProxy.setPubFreeData(actorInfo.tanbaoFrees[1], actorInfo.tanbaoFrees[2]);
        // }

        // if (rawget(actorInfo, "roleCreateTime") != null) {
        //     GameConfig.roleCreateTime = actorInfo.roleCreateTime;
        // }
        this._name = actorInfo.name;
        this._worldTileX = actorInfo.worldTileX;
        this._worldTileY = actorInfo.worldTileY;

        // this.setLegionLeaderWorldTilePos(actorInfo.legionLeaderX, actorInfo.legionLeaderY); //军团长的坐标

        this._playerId = actorInfo.playerId;    // 玩家ID
        GameConfig.actorid = actorInfo.playerId;

        this._iconId = actorInfo.iconId;         // 头像ID
        this._pendantId = actorInfo.pendantId;   // 挂件ID
        this._newGift = actorInfo.newGift;       // 是否领取过新手礼包：0未领取，1已领
        this._fightCount = actorInfo.fightCount; // 西域远征剩余挑战次数
        this._backCount = actorInfo.backCount;

        this._legionName = actorInfo.legionName; //军团名字
        this._legionLevel = actorInfo.legionLevel; //军团等级
        this._legionId = actorInfo.legionId;   //军团ID

        this._newGift = actorInfo.newGift;        //是否领取过新手礼包：0未领取，1已领
        if (this._newGift == 0 )
        {
            this.onTriggerNet20301Req()
        }
        // this.setCustomHeadStatus(actorInfo.customHeadStatus);
        // this.setCustomHeadCoolTime(actorInfo.customCoolTime);

        // let atom = StringUtils.fined64ToAtom(this._legionId); //TODO 容错，使用32位就行了
        // this.setRoleAttrValue(PlayerPowerDefine.POWER_LegionId, atom.low);

        // this.sendNotification(AppEvent.PROXY_LEGION_MAINSCENE_BUILDING_UPDATE, {});

        this.sendNotification(AppEvent.PROXY_GET_ROLE_INFO, data);

        // if (data.legionrewardinfo != null) {
        //     this.initOpenServerData(data.legionrewardinfo);
        // }

        // //TODO添加value有变化的typeid
        // let updatePowerList = {}
        // this.sendNotification(AppEvent.PROXY_UPDATE_ROLE_INFO, updatePowerList)
    }

    afterInitSyncData() {

    }

    resetCountSyncData(data) {

    }

    //===========================================公用函数===============================================

    //获取角色信息
    getActorInfo() {
        return this._actorInfo;
    }

    //判断是否已经创建角色
    isHasRole() {
        return this._name != "";
    }

    //设置角色属性
    setRoleAttrInfos(attrInfos) {
        this._attrInfoMap = {};
        for (let key in attrInfos) {
            let attrInfo = attrInfos[key];
            this.setRoleAttrValue(attrInfo.typeid, attrInfo.value);
        }

        this.sendNotification(AppEvent.PROXY_UPDATE_ROLE_INFO, null);
    }

    setRoleAttrValue(typeid, value) {
        this._attrInfoMap[typeid] = value;
        //logger.info("=========>检测任务小红点是否需要刷新");
        // if (typeid == getRoleAttrValue ){            
        //     //如果属性值是活跃度 检测任务小红点是否需要刷新
        //     let taskProxy = this.getProxy(GameProxys.Task)
        //     taskProxy:updateRedPoint()
        // }
    }

    /**
     * 方法说明 获得角色属性值
     * @method getRoleAttrValue
     * @param power power值,根据PlayerPowerDefine
     * @return 角色属性值
     */
    getRoleAttrValue(power){
        return this._attrInfoMap[power]
    }

    //============================================协议===================================================

    onTriggerNet20000Req() {
        this.syncNetReq(AppEvent.NET_M2, AppEvent.NET_M2_C20000, {})
    }

    //请求两万协议之后 还要做完新手引导
    onTriggerNet20301Req()
    {
        this.syncNetReq(AppEvent.NET_M2, AppEvent.NET_M2_C20301, {})
    }


    onTriggerNet20007Req(data) {
        this.syncNetReq(AppEvent.NET_M2, AppEvent.NET_M2_C20007, data)
    }
    onTriggerNet20007Resp(data) {
        return  //下面代码有报错，先屏蔽

            let gettype = data.gettype

            let config = ConfigDataManager.get(ConfigName.ShowControlConfig, gettype)

            
            let shieldID = (config == null ? {} : JSON.parse(config.shieldID))
                            
            let allShield = {}
            for (let key in shieldID){
                allShield[v] = true
            }

            let showType = 3
            if (config != nil) {
                showType = config.showType || 3
            }

        //     logger.error("!!!!!!!!!onTriggerNet20007Resp!!!!!!!gettype.%d!!!showType.%d!!!", gettype, showType)

        //     if gettype == RoleProxy.GUIDE_REWARD_TYPE then
        //         AnimationFactory.playAnimationByName("GuideRewardEffect", {})
        //         showType = 0
        //     end

        //     if showType ~= 0 then  --不是0的，则有对应的动画 --构建数值
        //         let tempData = {}
        //         tempData.rewards = {} 
        //         let index = 1
        //         let info = data
        //         let function checkShield(powerId, param, key)
        //             if not allShield[powerId] then
        //                 index = this.setDataRewardFly(param, tempData, index, powerId, key) --佣兵406
        //             end
        //         end
        //         checkShield(GamePowerConfig.Soldier, info.soldierList)
        //         checkShield(GamePowerConfig.Item, info.itemList)
        //         checkShield(GamePowerConfig.HeroTreasure, info.treasureInfos, "onlyOne")
        //         checkShield(GamePowerConfig.HeroTreasureFragment, info.treasurePieceInfos)
        //         checkShield(GamePowerConfig.OrdnanceFragment, info.odpInfos)
        //         checkShield(GamePowerConfig.General, info.equipinfos, "onlyOne")
        //         checkShield(GamePowerConfig.Hero, info.heros) -- -- 武将 #4300 飘窗只飘一本武经（实际不止得到一本）。 
        //         checkShield(GamePowerConfig.Ordnance, info.odInfos, "onlyOne")
        //         checkShield(GamePowerConfig.HeroFragment, info.heroPieceInfos) -- 412  --武将碎片
        //         checkShield(GamePowerConfig.Counsellor, info.adviserInfos, 1) --军师 405

        //         if rawget(info, "diffs") then
        //             checkShield(GamePowerConfig.Resource, info.diffs, "value")
        //         end

        //         if showType == 1 then --飘窗
        //             if index > 1 then
        //                 AnimationFactory.playAnimationByName("BagFreshFly", tempData)
        //             end
        //         else
        //             let all = 0 
        //             for k,v in pairs(tempData.rewards) do
        //                 if v.num <= 0 then
        //                     tempData.rewards[k] = nil -- 过滤num不科学的字节
        //                 end
        //             end
        //             let rewardData = {} -- 真-奖励数据
        //             for k,v in pairs(tempData.rewards) do
        //                 if not rewardData[v.typeid] then
        //                     rewardData[v.typeid] = {}
        //                 end
        //                 if not rewardData[v.typeid][v.power] then
        //                     rewardData[v.typeid][v.power] = v
        //                 else
        //                     rewardData[v.typeid][v.power].num = rewardData[v.typeid][v.power].num + v.num
        //                 end
        //                 all = all + 1
        //             end
        //             if all ~= 0 then
        //                 let result = {}
        //                 for k,v in pairs(rewardData) do
        //                     for ka,va in pairs(v) do
        //                         table.insert(result, va)
        //                     end
        //                 end

        //                 if showType == 2 then  --弹窗
        //                     AnimationFactory.playAnimationByName("GetPropAnimation", result)
        //                 elseif showType == 3 then  --特效
        //                     AnimationFactory.playAnimationByName("GetGoodsEffect", result)
        //                 end
        //             end
        //         end
        //     end

        //    ------------------------------上面的全局动画处理-----------------------------------------------------------------

        //     if rawget(data, "diffs") then
        //         this.onTriggerNet20002Resp({diffs = data.diffs})  --playAnimationByName
        //     end

            let soldierList = data.soldierList
            let itemList = data.itemList
            let odpInfos = data.odpInfos
            let equipInfos = data.equipinfos
            let generals = data.generals
            let odInfos = data.odInfos
            let adviserInfos = data.adviserInfos
            let heros = data.heros
            let treasureInfos = data.treasureInfos
            let treasurePieceInfos = data.treasurePieceInfos
            let postInfos = data.postInfos    
            let heroPieceInfos = data.heroPieceInfos

            // if (heroPieceInfos.lenght > 0){
            //     let heroProxy = this.getProxy(GameProxys.Hero)
            //     heroProxy.updateHeroPieceInfos(heroPieceInfos)
            // }
                
            if (soldierList.lenght > 0) {
                let soldierProxy = this.getProxy(GameProxy.Soldier)
                soldierProxy.updateSoldiersList(soldierList)
            }

            // if (itemList.lenght > 0 ){
            //     let itemProxy = this.getProxy(GameProxys.Item)
            //     itemProxy.updateItemInfos(itemList)
            // }
                
            // if (odInfos.lenght > 0){
            //     let partsProxy = this.getProxy(GameProxys.Parts)
            //     partsProxy.updateOrdnanceInfos(odInfos)
            // }
                

            // if (equipInfos.lenght > 0 ){
            //     let partsProxy = this.getProxy(GameProxys.Equip)
            //     partsProxy.updateAllEquips(equipInfos)
            // }
                
            // if (generals.lenght > 0 ){
            //     let equipProxy = this.getProxy(GameProxys.Equip)
            //     equipProxy.updateAllGenerals(generals)
            // }
                
            // if (odpInfos.lenght > 0 ){
            //     let partsProxy = this.getProxy(GameProxys.Parts)
            //     partsProxy.updatePieceInfos(odpInfos)
            // }
                
            // if (adviserInfos.lenght > 0 ){
            //     let consigProxy = this.getProxy(GameProxys.Consigliere)
            //     consigProxy.onNewInfoResp(adviserInfos)
            // }

        //     if heros ~= nil and #heros > 0 then
        //         let heroProxy = this.getProxy(GameProxys.Hero)
        //         let isRefresh = true
        //         --获取到英雄，打开获取面板
        //         let heroIdList = {}
        //         for _, hero in pairs(heros) do
        //             if hero.heroId > 0 then
        //                 --只重置一次table
        //                 if isRefresh then
        //                     heroProxy.resetResolveData()
        //                 end
        //                 isRefresh = false
        //                 let isResolve = heroProxy.isResolve(hero)
        //                 let isExpCar = heroProxy.isExpCar(hero)
        //                 if not isExpCar then
        //                     let heroData = heroProxy.getInfoById(hero.heroDbId)
        //                     if heroData == nil then


        //                         table.insert(heroIdList, hero)
        //                     end
        //                 end
        //             end
        //         end
        //         if #heroIdList > 0 then
        //             let function delayShowModule(heroIdList)
        //                 this.showModule({moduleName = ModuleName.HeroGetModule, extraMsg = heroIdList})
        //             end

        //             EffectQueueManager.addEffect(EffectQueueType.GET_HERO, delayShowModule, heroIdList)
        //             -- TimerManager.addOnce(40, delayShowModule, self, {moduleName = ModuleName.HeroGetModule, extraMsg = heroIdList})
        //         end

        //         heroProxy.updateHeroInfo(heros)
        //     end


        //     if postInfos and #postInfos > 0 then
        //         let heroTreasureProxy = this.getProxy(GameProxys.HeroTreasure)
        //         heroTreasureProxy.updatePostInfos(postInfos)
        //     end
        //     if treasureInfos and #treasureInfos > 0 then
        //         let heroTreasureProxy = this.getProxy(GameProxys.HeroTreasure)
        //         heroTreasureProxy.updateTreasureInfo(treasureInfos)
        //     end
        //     if treasurePieceInfos and #treasurePieceInfos > 0 then
        //         let heroTreasureProxy = this.getProxy(GameProxys.HeroTreasure)
        //         heroTreasureProxy.updateTreasurePieceInfo(treasurePieceInfos)
        //     end



        //     this.sendNotification(AppEvent.PROXY_UPDATE_BUFF_NUM, data)

        //     --//全局动画信息
        //     let skillProxy =this.getProxy(GameProxys.Skill)
        //     skillProxy.isLevelUpSkill()

    }

    /**
     * 方法说明 向服务器请求创建角色
     * @method onTriggerNet20008Req
     * @param null
     * @return null
     */
    onTriggerNet20008Req(data) {
        this.syncNetReq(AppEvent.NET_M2, AppEvent.NET_M2_C20008, data)
    }


    /**
     * 方法说明 向服务器请求创建角色返回
     * @method onTriggerNet20008Resq
     * @param null
     * @return null
     */
    onTriggerNet20008Resp(data) {
        if (data.rs == 0) {
            this.sendNotification(AppEvent.PROXY_CREATE_ROLE_SUCCESS, data)
        } else {
            logger.info("data.rs == ", data.rs == 0)
        }
    }


    onTriggerNet20002Req(data) {
        this.syncNetReq(AppEvent.NET_M2, AppEvent.NET_M2_C20002, data);
    }
    onTriggerNet20002Resp(data) {
        logger.info("==========>需要完善onTriggerNet20002Resp")
        // let isFightWeightUpdate = false
        // let diffs = data.diffs
        // let isUpdate = false
        // let updatePowerList = {}
        // if not isNotShowFly == true then
        //     -- 09.21 策划需求，屏蔽飘资源
        //     -- self:onAttrDifInfoFly(data)
        // end
        // -- 09.21 策划需求，屏蔽飘资源
        // --ComponentUtils:showGetExpAction(self, data)

        // for _, diff in pairs(diffs) do
        //     --做属性相关逻辑处理
        //     let oldValue = self:getRoleAttrValue(diff.typeid)
        //     if oldValue ~= diff.value then
        //         isUpdate = true
        //         table.insert(updatePowerList, diff.typeid)
        //         ComponentUtils:roleInfoDifEffect(self, diff)
        //         if diff.typeid == PlayerPowerDefine.POWER_command or 
        //             diff.typeid == PlayerPowerDefine.POWER_level or
        //             (diff.typeid >= SoldierDefine.POWER_hpMax and
        //             diff.typeid <= SoldierDefine.POWER_damder) then
        //             isFightWeightUpdate = true
        //         end

        //         self:setRoleAttrValue(diff.typeid, diff.value)
        //         if diff.typeid == PlayerPowerDefine.POWER_level then --等级改变，发送日志
        //             let actorInfo = self:getActorInfo()
        //             GameConfig.actorid = actorInfo.playerId
        //             GameConfig.actorName = actorInfo.name
        //             GameConfig.level = self:getRoleAttrValue(PlayerPowerDefine.POWER_level)
        //             let userMoney = self:getRoleAttrValue(PlayerPowerDefine.POWER_gold)
        //             SDKManager:sendExtendDataRoleLevelUp(userMoney)

        //             --检测新功能开启
        //             let list = ConfigDataManager:getInfosFilterByTwoKey(
        //                   ConfigData.NewFunctionOpenConfig, "need", diff.value, "type", 1)
        //             if #list > 0 then
        //                 let function delayShowModule(data)
        //                     self:showModule({moduleName = ModuleName.UnlockModule, extraMsg = data})
        //                     -- 判断军师解锁
        //                     if data.openLevel == 26 and data.openType == 1 then
        //                         self:sendNotification(AppEvent.PROXY_OPEN_BUILD_CONSIGRE,{})
        //                     end
        //                     -- 判断点兵解锁，刷新红点
        //                     let norNeed = ConfigDataManager:getConfigById(ConfigData.NewFunctionOpenConfig,5).need
        //                     let speNeed = ConfigDataManager:getConfigById(ConfigData.NewFunctionOpenConfig,9).need
        //                     if data.openLevel == norNeed or data.openLevel == speNeed then
        //                         let redPointProxy = self:getProxy(GameProxys.RedPoint)
        //                         redPointProxy:checkFreeFindBoxRedPoint() 
        //                     end
        //                     -- 主界面的周卡入口开放
        //                     let weekCardNeed = ConfigDataManager:getConfigById(ConfigData.NewFunctionOpenConfig,54).need
        //                     if data.openLevel == weekCardNeed then
        //                         let activityProxy = self:getProxy(GameProxys.Activity)
        //                         activityProxy:sendNotification(AppEvent.PROXY_ACTIVITY_WEEKCARD_UPDATE)
        //                     end
        //                 end
        //                 EffectQueueManager:addEffect(EffectQueueType.UNLOCK, delayShowModule, {openType = 1, openLevel = diff.value})
        //             end
        //         end

        //         -- （繁荣/体力更新）是否创建定时器  add by fzw 
        //         if diff.typeid == PlayerPowerDefine.POWER_boom or diff.typeid == PlayerPowerDefine.POWER_energy or diff.typeid == PlayerPowerDefine.POWER_crusadeEnergy then
        //             self:updateRoleRemainTime(diff)
        //         end
        //         if diff.typeid == PlayerPowerDefine.POWER_legionLevel then
        //             this._legionLevel = diff.value
        //         end
        //     end
        // end

        // if isUpdate == true then
        //     let buildingProxy = self:getProxy(GameProxys.Building)
        //     buildingProxy:updateRoleInfo(updatePowerList)

        //     self:sendNotification(AppEvent.PROXY_UPDATE_ROLE_INFO, updatePowerList)
        // end

        // if isFightWeightUpdate == true then
        //     let soldierProxy = self:getProxy(GameProxys.Soldier)
        //     soldierProxy:soldierMaxFightChange()
        // end
        // self:sendNotification(AppEvent.POWER_VALUE_UPDATE, {})
        // let redPointProxy = self:getProxy(GameProxys.RedPoint)
        // redPointProxy:checkTaskRedPoint()   
        // redPointProxy:setSpringSquibRed() 
        // redPointProxy:setCookingRed() 
    }
}

export default RoleProxy;