import PuppetFactory from "PuppetFactory"
import GameProxy from "GameProxy"


let battleCount = 1

let mapId = 101

export class Battle {

    

    constructor(panel) {
        //super(action)
        this._battlePanel = panel
        
        this._battleData = null;

        // this._battleModule = battleModule
        // this._battleView = battleModule.getView()
        this._panelMap = this._battlePanel._panelMap

        this._battleTimerList = {};
    }

    getProxy(proxyName){
        let proxy = this._battlePanel.getAction().getProxy(proxyName);
        return proxy;
    }

    finalize() {
        PuppetFactory.getInstance().finalize()

        this.stopTimers()

        if (this._uiParticle != null) {
            this._uiParticle.finalize()
            this._uiParticle = null
        }
    }

    update(dt) {
        //处理时间回调
        this._battleTimeListHandle()
    }

    _battleTimeListHandle() {
        let len = this._battleTimerList.lenght
        while (len--) {
            let info = this._battleTimerList[len]
            info.delay -= dt
            if (info.delay < 0) {
                info.callback.call(info.obj, arys)
            }
        }
    }

    //统一添加定时器入口，跳过时，统一释放掉定时器，以免出现问题
    addTimerOnce(delay, func, obj, arys) {
        //TimerManager.addOnce(delay, func, obj, arys)
        this._battleTimerList.push({ delay: delay, func: func, obj: obj })
    }

    stopTimers() {
        //需要把所有的定时器清空
        // for (let key in this._battleTimerList) {
        //     let timer = this._battleTimerList[key]
        //     let func = timer.func
        //     let obj = timer.obj
        //     TimerManager.remove(func, obj)
        // }
        this._battleTimerList = []

        this._battlePanel.stopAllActions()

        let ents = PuppetFactory.getInstance().getEntitys()
        for (let key in ents) {
            ents[key].stopAllActions()
        }
    }

    //开始战斗
    startBattle() {

        let battleProxy = this.getProxy(GameProxy.Battle)
        
        let battle = battleProxy.getCurBattleData()

        let isAaccelerate = battleProxy.isAaccelerate()
        if (isAaccelerate == true) {
            cc.director.getScheduler().setTimeScale(1.6) //默认2倍速度战斗
        }

        battleCount = battleCount + 1


        this._rounds = battle.rounds
        this._reward = battle.reward

        // if (this._battleData.rc == 3 || this._battleData.rc == 2) {  //rc=3重播,rc=2战斗播报,直接按播放处理
        // } else {
        //     if (battleData.saveTraffic == 1) { //不看战斗。直接弹出结果面板

        //         this.onEndBattle()

        //         return
        //     }
        // }

        this._puppetNum = battle.puppets.lenght
        this._curPuppetIndex = 1
        this._puppets = battle.puppets
        //TODO 可能要一个一个创建出来
        //this.delayCreatePuppet(1)
        for (let key in this._puppets){
            let puppet = this._puppets[key]
            let ent = this.createPuppet(puppet)
        }
    }

    


    createPuppets() {
        //    for _, puppet in pairs(puppets) do
        //        this.createPuppet(puppet)
        //    }

        this._curPuppetIndex = this._curPuppetIndex + 1
        if (this._curPuppetIndex > this._puppetNum) {
            // let battleProxy = this._battleModule.getProxy(GameProxys.Battle)
            // battleProxy.resumeUIAnimation()
            this._animationComplete() //创建完，才开始跑
        } else {
            this.addTimerOnce(3, this.delayCreatePuppet, this, this._curPuppetIndex)
        }
    }

    delayCreatePuppet(index) {
        let puppet = this._puppets[index]
        let ent = this.createPuppet(puppet) //如果佣兵数量为0，返回nil

        if (ent != null) {
            let curMove = 0 //貌似多余的
            let maxMove = 0 //貌似多余的

            // let name = ent.getName()
            // let camp = ent.getCamp()
            // this._battlePanel.setNameByCamp(name, camp)

            ent.setVisible(false)
        }

        this.createPuppets()
    }

    //开局佣兵移动进场
    allBirthMove() {
        let entitys = PuppetFactory.getInstance().getEntitys()
        let maxNum = table.size(entitys)
        let curEndMoveNum = 0
        let birthMoveComplete = (function () {
            curEndMoveNum = curEndMoveNum + 1
            if (curEndMoveNum >= maxNum) {
                this.addTimerOnce(30, this.playChangeZhenfa, this)
            }
        }).bind(this)

        let delayBirthMove = function (ent) {
            ent.setVisible(true)
            ent.birthMove(birthMoveComplete)
        }

        for (let key in entitys) {

            this.addTimerOnce(30, delayBirthMove, entitys[key])
            //        ent.playBirthAction()
        }
    }

    //一下是旧逻辑出场
    leftBirthMove() {

        let lefts = PuppetFactory.getInstance().getEntitysByCamp(BattleCamp.Left)
        let maxNum = lefts.lenght
        let curEndMoveNum = 0
        let birthMoveComplete = (function () {
            curEndMoveNum = curEndMoveNum + 1
            if (curEndMoveNum >= maxNum) {
                //            AudioManager.playEffect("battle", "wav")
                //            let lefts = PuppetFactory.getInstance().getEntitysByCamp(BattleCamp.Left)
                //            for _, ent in pairs(lefts) do
                //                ent.playAnimation(ModelAnimation.Win, true)
                //            }
                //            TimerManager.addOnce(1000, this.beforeBattle, this)
                this.beforeBattle()
            }
        }).bind(this)

        for (let key in lefts) {
            let ent = lefts[key]
            ent.setVisible(true)
            ent.birthMove(birthMoveComplete)
            ent.playBirthAction()
        }

    }


    beforeBattle() {
        let lefts = PuppetFactory.getInstance().getEntitysByCamp(BattleCamp.Left)
        for (let key in lefts) {
            lefts[key].playAnimation(ModelAnimation.Run, true)
        }

        let rights = PuppetFactory.getInstance().getEntitysByCamp(BattleCamp.Right)

        let callback = function () {
            logger.info("=====对面的也要出场咯==========")
            for (let key in rights) {
                let ent = rights[key]
                ent.setVisible(true)
                ent.birthMove()
                ent.playBirthAction()
            }
        }

        let complete = function () {
            for (let key in pairslefts) {
                pairslefts[key].playAnimation(ModelAnimation.Wait, true)
            }

            this.addTimerOnce(30, this.playChangeZhenfa, this)
        }

        this._battlePanel.moveFrontBg(callback, complete)
    }

    playChangeZhenfa() {
        //    let ents = PuppetFactory.getInstance().getEntitys()
        //    for _, ent in pairs(ents) do
        //        ent.changeZhenfa(0, 200)
        //    }

        this.addTimerOnce(300, this.playBirthBuff, this)
    }

    //出场buff
    playBirthBuff() {

        let delayPlayBirthBuffEffect = function (ent) {
            ent.playBirthBuffEffect()
        }

        let ents = PuppetFactory.getInstance().getEntitys()
        for (let key in ents) {
            this.addTimerOnce(30, delayPlayBirthBuffEffect, ents[key])
        }

        this.addTimerOnce(1000, this.readyBattle, this)

    }

    readyBattle() {

        let ents = PuppetFactory.getInstance().getEntitys()
        for (let key in ents) {
            ents[key].playAnimation(ModelAnimation.Wait, true)
        }

        this.addTimerOnce(300, this.startRoundBattle, this)
    }

    startRoundBattle() {
        this._curRoundNum = 1

        let round = this._rounds[this._curRoundNum]
        this.startRound(round)
    }

    //回合开始
    startRound(round) {

        if (this._isSkip == true) {
            return
        }

        this._battlePanel.onUpdateRound(this._curRoundNum)

        let r = Round.new(round, this)
        r.startRound()

    }

    //下一回合
    nextRound() {
        if (this._isSkip == true) {
            return
        }
        this._curRoundNum = this._curRoundNum + 1
        let round = this._rounds[this._curRoundNum]

        if (round != null) {
            this.startRound(round)
        } else {
            logger.info("======战斗结束================")
            // this.onEndBattle()
            this.consiAttackAction()
        }
    }

    //军师播放死亡动作(重播/回看不执行死亡动作)
    // 根据胜利失败决定哪方军师死亡
    consiAttackAction() {
        let consIndex
        if (this._battleData.rc == 0) {  //胜利
            consIndex = ModelConsIndex.Right
        } else if (this._battleData.rc == 1) {  //失败
            consIndex = ModelConsIndex.Left
        } else {
            this.onEndBattle()
            return
        }

        let consiEnt = PuppetFactory.getInstance().getEntity(consIndex)
        if (consiEnt) {
            let endCall = (function () {
                consiEnt.setVisible(false)
                this.onEndBattle()
            }).bind(this)
            consiEnt.playAnimation(ModelAnimation.Die, false, endCall)
        } else {
            this.onEndBattle()
        }
    }

    onEndBattle() {
        if (this._battleData.rc == 0) {
            logger.info("======战斗胜利==========")
        } else {
            logger.info("======战斗失败========== rc:%d", this._battleData.rc)
        }

        cc.director.getScheduler().setTimeScale(1) //战斗结束，重置加速

        if (this._battleData.rc == 3 || this._battleData.rc == 2) {  //rc=3重播，直接退出。 rc=2 战斗播报，直接退出。
            this._battlePanel.dispatchEvent(BattleEvent.HIDE_SELF_EVENT, {})
        } else {
            this._battleView.showBattleResultPanel(this._battleData)
        }

    }

    //是否要请求战斗结束
    isReqBattleEnd() {
        return not(this._battleData.rc == 3 || this._battleData.rc == 2)
    }

    //跳过战斗
    onSkipBattle() {
        this._isSkip = true

        this.onEndBattle()

        //    this.finalize()
    }

    ////////////////
    createPuppet(puppet) {

        let attr = puppet.attr
        // logger.info("创建佣兵attr index=%d、name=%s、num=%d、modelList=%d", attr.index, attr.name, attr.num, attr.modelList)

        if (attr.num == 0) {
            logger.error("出现数量为0的佣兵数据···attr：index=%d、name=%s、num=%d", attr.index, attr.name, attr.num)
            return null
        }

        let mapPanel = this._panelMap;
        let rootNode = mapPanel.getChildByName("indexPanel" + attr.index)
        
        let ent = PuppetFactory.getInstance().create(attr, rootNode)
        ent.setBattleHandle(this)
        ent.setBattlePanel(this._battlePanel)
        return ent
    }



    getView() {
        return this._view
    }

    getBattleView() {
        return this._battleView
    }

    playShark() {

        if (this._startShark == true) {
            return
        }

        let endSharkCall = (function () {
            this._startShark = false
        }).bind(this)

        this._startShark = true
        let layer = this._battleModule.getCurLayer()
        NodeUtils.shark(layer, null, endSharkCall)
    }



}

export default Battle
















