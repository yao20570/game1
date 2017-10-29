/**
 * Created by on 2017/9/28.
 */
import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameModule from "GameModule"
import ConfigName from "ConfigName";
import ConfigDataManager from "ConfigDataManager";
import LocalDBManager from "LocalDBManager";
import { BattleType } from "GameEnum";
import { GameDefine } from "GameDefine";


class BattleProxy extends BasicProxy {
    constructor() {
        super();

        this.proxyName = GameProxy.Battle

        this._curBattleId = 0
        this._isAaccelerate = true
        this._firstAtkArr = ["前排先手", "后排先手", "上列先手", "中列先手", "下列先手"]
    }

    //重置数据，在切换账号的时候重置调用
    resetAttr() {
        this._curBattleId = 0
        this._isAaccelerate = true
    }

    //数据代理全部初始化前调用
    beforeInitSyncData() {
        for (let key in BattleType) {
            let v = BattleType[key]
            if (v == 2) {
                let config = ConfigDataManager.getTable(ConfigName.AdventureConfig)
                for (let key in config) {
                    LocalDBManager.setValueForKey(GameDefine.isAutoBattle + v + config[key].type, "no")
                }
            } else {
                LocalDBManager.setValueForKey(GameDefine.isAutoBattle + v, "no")
            }
        }
    }

    //数据代理初始化
    initSyncData(data) {
        this._allBattleData = {}
    }

    //数据代理全部初始化完后调用
    afterInitSyncData() {
    }

    //每天数据重置调用
    resetCountSyncData(data) {
    }

    //===========================================公用函数===============================================



    //获取当前的战斗数据
    getCurBattleData() {
        return this._curBattleData
    }

    getBattleDataById(id) {
        return this._allBattleData[id]
    }

    startWorldBossAttack() {
        this._hasWorldBossBattle = true
    }

    getWorldBossBattle() {

        if (this._worldBattleData != null) {
            let data2 = {}
            data2["moduleName"] = ModuleName.BattleModule
            data2["extraMsg"] = { battleData: this._worldBattleData }
            this.sendAppEvent(AppEvent.MODULE_EVENT, AppEvent.MODULE_OPEN_EVENT, data2)
        }

        this._worldBattleData = null //
        this._hasWorldBossBattle = false
    }

    //请求战斗
    //战斗请求
    startBattleReq(data) {
        this.preUIAnimation()
        let isAuto = LocalDBManager.getValueForKey(GameDefine.isAutoBattle + data.type)
        if (data.type == 2) {
            let proxy = this.getProxy(GameProxy.Dungeon)
            let type, dunId = proxy.getCurrType()
            let info = ConfigDataManager.getInfoFindByOneKey("AdventureConfig", "ID", dunId)
            isAuto = LocalDBManager.getValueForKey(GameDefine.isAutoBattle + data.type + info.type)
        }


        let saveTraffic = (isAuto == "yes" ? 1 : 0)


        data["saveTraffic"] = saveTraffic


        if (data.type == 6) {
            // 军团副本请求战斗 发270002
            let sendData = {}
            sendData.infos = data.infos
            sendData.id = data.id
            let str = LocalDBManager.getValueForKey(GameDefine.isAutoBattle + data.type)
            sendData.saveTraffic = saveTraffic
            logger.info("军团副本请求战斗 id=%d", data.id)
            let proxy = this.getProxy(GameProxy.DungeonX)
            proxy.onTriggerNet270002Req(sendData)
            return
        }

        if (data.type == 3) {
            //据说演武场不带出战列表
            data.infos = {}
        }

        for (let key in data.infos) {
            let v = data.infos[key]
            if (v.post == 9) {
                this.battleConsuId = v.typeid
            }
        }
        this.syncNetReq(AppEvent.NET_M5, AppEvent.NET_M5_C50000, data)
    }

    getBattleConsuId() {
        return this.battleConsuId
    }

    //设置是否不看战报状态
    setIsAutoBattle(state) {
        this._notWatchBattleState = state
    }

    getIsAutoBattle() {
        return this._notWatchBattleState
    }

    getCurBattleId() {
        return this._curBattleId
    }

    getCurBattleType() {
        return this._curBattleType
    }

    isAaccelerate() {
        return this._isAaccelerate
    }

    setAaccelerate(value) {
        this._isAaccelerate = value
    }

    preUIAnimation() {
        // let layer = this.getCurGameLayer(GameLayer.uiTopLayer)
        // let uiAnimation = UIAnimation.new(layer, "001", false)
        // uiAnimation.play(null, false)

        // uiAnimation.pause()
        // this._uiAnimation = uiAnimation

        // this.createUIAnimation()
    }

    resumeUIAnimation() {
        if (this._uiAnimation == null) {
            logger.info("特效不存在啦，，播放不了 了了了了")
            return
        }
        this._uiAnimation.resume()
        this._uiAnimation = null
    }

    setCompleteCallback(callback) {
        this._uiAnimation.setCompleteCallback(callback)
    }


    createUIAnimation(ccbiName, completeFunc, isPlayOnce, order) {
        // new ccbi
        ccbiName = ccbiName || "rgb-guochangyun2"
        completeFunc = completeFunc || null
        isPlayOnce = isPlayOnce || true
        order = order || 9000

        // let winSize = cc.Director.getInstance().getWinSize()
        let visibleSize = cc.Director.getInstance().getVisibleSize()
        let layer = this.getCurGameLayer(GameLayer.uiTopLayer)

        // UICCBLayer.ctor(ccbname, parent, owner, completeFunc, isPlayOnce)
        let uiAnimation = UICCBLayer.new(ccbiName, layer, null, completeFunc, isPlayOnce)
        this._uiAnimation = uiAnimation
        uiAnimation.setPosition(visibleSize.width / 2, visibleSize.height / 2)
        uiAnimation.setLocalZOrder(order)


        let pauseCallback = function () {
            // body
            logger.info("暂停播放特效啦啦啦 pauseCallback")
            uiAnimation.pause()
        }
        TimerManager.addOnce(400, pauseCallback, this)

    }

    getFirstAtkArr() {
        return this._firstAtkArr
    }


    //============================================协议===================================================

    onTriggerNet50000Resp(data) {
        this._notWatchBattleState = false //一次性
        if (data.rc < 0) {
            this.resumeUIAnimation()
            //TODO 战斗异常时，需要还原处理
            return //战斗异常
        }

        if (this._uiAnimation == null) {
            this.preUIAnimation() //服务器主动推送战斗包
        }
        this._allBattleData[data.battle.id] = data
        this._curBattleId = data.battle.id
        this._curBattleType = data.battle.type

        this._curBattleData = data.battle

        //世界BOSS的战斗，判断是否已经播放过了，不直接播放了
        //视图那边还没有去拿战斗数据，先缓存起来，
        //如果战斗包还没有到，就去拿战斗包的话，则直接播放战斗
        if (this._curBattleType == BattleType.world_boss && this._hasWorldBossBattle == true) {
            this._worldBattleData = data;
        } else {
            //打开模块
            this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.BattleModule });
            //播放战斗
            this.sendNotification(AppEvent.PROXY_BATTLE_START, data.battle);

            //打完之后，刷新同盟建设度
            if (data.type == 6) {
                let name = this.getProxy(GameProxy.Role).getLegionName();
                //是否加入了同盟
                if (name != "") {
                    let legionProxy = this.getProxy(GameProxy.Legion);
                    legionProxy.onTriggerNet220007Req({ opt: 0 });
                }
            }
        }
    }

    //请求战斗结束
    onTriggerNet50001Req(data) {
        this.syncNetReq(AppEvent.NET_M5, AppEvent.NET_M5_C50001, data)
    }

    //战斗结束数据包
    onTriggerNet50001Resp(data) {
        this.sendNotification(AppEvent.PROXY_BATTLE_END, data)
    }
}

export default BattleProxy;