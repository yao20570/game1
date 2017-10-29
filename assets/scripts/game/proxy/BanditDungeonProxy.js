/**
 * Created by on 2017/9/28.
 */
import BasicProxy from "BasicProxy";
import logger from "Logger";
import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameConfig from "GameConfig";

class BanditDungeonProxy extends BasicProxy {
    constructor() {
        super();

        this._banditDungeonMap = {}

        this._isAllKill = false

    }

    //重置数据，在切换账号的时候重置调用
    resetAttr() {
        this._banditDungeonMap = {}
    }

    //数据代理全部初始化前调用
    beforeInitSyncData() {
    }

    //数据代理初始化
    initSyncData(data) {
        super.initSyncData(data)

        let banditDungeonInfos = data.banditDungeonInfos

        for (let key in banditDungeonInfos) {
            let banditDungeonInfo = banditDungeonInfos[key]
            let key = this.getBanditDungeonKey(banditDungeonInfo.x, banditDungeonInfo.y)
            this.updateBanditDungeon(banditDungeonInfo)
        }
    }

    //数据代理全部初始化完后调用
    afterInitSyncData() {
    }

    //每天数据重置调用
    resetCountSyncData(data) {
    }

    //===========================================公用函数===============================================

    //是否击杀所有黄巾军
    getIsAllKill() {
        return this._isAllKill
    }

    setIsAllKill(bool) {
        this._isAllKill = bool
    }

    //获取剿匪副本信息,通过世界坐标
    getBanditDungeon(x, y) {
        let key = this.getBanditDungeonKey(x, y)
        if (this._banditDungeonMap[key] && this._banditDungeonMap[key].eventId <= 0) {
            return null
        }
        return this._banditDungeonMap[key]        
    }

    //更新剿匪副本
    updateBanditDungeon(banditDungeonInfo) {

        //-先把旧的删除掉
        let oldKey = ""
        for (let key in this._banditDungeonMap) {
            let bandit = this._banditDungeonMap[key]
            if (bandit.id == banditDungeonInfo.id) {
                oldKey = this.getBanditDungeonKey(bandit.x, bandit.y)
                break;
            }
        }
        delete this._banditDungeonMap[oldKey];


        let key = this.getBanditDungeonKey(banditDungeonInfo.x, banditDungeonInfo.y)
        this._banditDungeonMap[key] = banditDungeonInfo

        let remainRestTime = banditDungeonInfo.remainRestTime
        if (remainRestTime >= 0) {
            this.scheduRestBandit(banditDungeonInfo.id, remainRestTime)
        }
    }


    getBanditDungeonKey(x, y) {
        return x + y
    }

    getAllBandData() {
        return this._banditDungeonMap
    }

    //休整倒计时
    scheduRestBandit(id, remainRestTime) {
        let scheduKey = this.getScheduKey(id)

        this.pushRemainTime(scheduKey, remainRestTime, AppEvent.NET_M34_C340000, { id : id }, this.onTriggerNet340000Req)
    }

    //获取剩余的休整时间
    getRemainRestTime(id) {
        let scheduKey = this.getScheduKey(id)
        return this.getRemainTime(scheduKey)
    }

    getScheduKey(id) {
        return "banditRest" + id
    }

    //获取一个剿匪副本的世界坐标
    //主要用来引导的时候，直接跳转过去
    getOneBandit() {
        let bandit = null
        for (let key in this._banditDungeonMap) {
            bandit = this._banditDungeonMap[key]
            break
        }
        return bandit
    }


    //============================================协议===================================================

    ////-副本数据同步，休整时间结束后，才会请求
    onTriggerNet340000Req(data) {
        for (let key in data) {
            let reqData = data[key];
            this.syncNetReq(AppEvent.NET_M34, AppEvent.NET_M34_C340000, { id: reqData.id })
        }
    }

    //////////////////////////-请求剿匪副本战斗//////////////

    //剿匪副本数据统本返回
    onTriggerNet340000Resp(data) {
        let rs = data.rs

        if (rs == 0) {
            this.updateBanditDungeon(data.banditInfo)
        } else if (rs == ErrorCodeDefine.M340000_2) {
            this.scheduRestBandit(data.id, data.remainRestTime)
        } else {
            this.scheduRestBandit(data.id, 0)
        }

        this.sendNotification(AppEvent.PROXY_BANDIT_DUNGEON_UPDATE, {})
    }

    onTriggerNet340001Req(data) {
        this.syncNetReq(AppEvent.NET_M34, AppEvent.NET_M34_C340001, data)
    }
    //剿匪副本战斗返回
    onTriggerNet340001Resp(data) {
        let rs = data.rs
        if (rs == 0) {
            //isAllKill 0表示未杀死所有黄巾军  1表示杀死
            //print("data.isAllKill data.isAllKill",data.isAllKill)
            this.updateBanditDungeon(data.banditInfo)

            if (data.isAllKill == 0) {
                this.setIsAllKill(false)
            } else {
                this.setIsAllKill(true)
                let openData = {}
                openData.moduleName = ModuleName.TellTheWorldModule
                openData.extraMsg = { eventId : 1, winnerInfo : null, loserInfo : null }
                this.sendAppEvent(AppEvent.MODULE_EVENT, AppEvent.MODULE_OPEN_EVENT, openData)
            }

            if (this.getIsAllKill()) {
                this._banditDungeonMap = {}
            }

            this.sendNotification(AppEvent.PROXY_BANDIT_DUNGEON_UPDATE, "battle")
        }
    }

    //更新所有的剿匪副本，当新号的时候，需要这样子处理
    //由世界坐标点生成触发
    onTriggerNet340002Resp(data) {
        for (let key in data.infos) {
            let banditDungeonInfo = data.infos[key]
            let key = this.getBanditDungeonKey(banditDungeonInfo.x, banditDungeonInfo.y)
            this.updateBanditDungeon(banditDungeonInfo)
        }

        this.sendNotification(AppEvent.PROXY_BANDIT_DUNGEON_UPDATE, {})
    }
}

export default BanditDungeonProxy;