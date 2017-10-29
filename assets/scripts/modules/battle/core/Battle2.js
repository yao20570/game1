//module("battleCore", package.seeall)

let battleCount = 1

let mapId = 101

class Battle {
    constructor(battleModule) {
        this._battleModule = battleModule
        this._battleView = battleModule.getView()
        this._battlePanel = this._battleView.getPanel(BattlePanel.NAME)
        // this._enterBattlePanel = this._battleView.getPanel(BattleEnterPanel.NAME)
        this._battleTimerList = {}
    }

    finalize() {
        PuppetFactory.getInstance().finalize()

        this.stopTimers()

        if (this._uiParticle != null) {
            this._uiParticle.finalize()
        }

        this._uiParticle = null
    }

    stopTimers() {
        //需要把所有的定时器清空
        for (let key in this._battleTimerList) {
            let timer = this._battleTimerList[key]
            let func = timer.func
            let obj = timer.obj
            TimerManager.remove(func, obj)
        }

        this._battleTimerList = {}

        this._battlePanel.stopAllActions()

        let ents = PuppetFactory.getInstance().getEntitys()
        for (let key in ents) {
            ents[key].stopAllActions()
        }
    }

    startBattle(battleData) {
        let battleProxy = this._battlePanel.getProxy(GameProxys.Battle)
        let isAaccelerate = battleProxy.isAaccelerate()
        if (isAaccelerate == true) {
            cc.Director.getScheduler().setTimeScale(1.6) //默认2倍速度战斗
        }

        battleCount = battleCount + 1

        this._battlePanel.hideSkipBtn()
        this._battlePanel.hideAccelerateBtn()

        this._battleData = battleData

        let battle = battleData.battle
        this._rounds = battle.rounds
        this._reward = battle.reward

        this.initBattleView(battle)


        if (this._battleData.rc == 3 || this._battleData.rc == 2) {  //rc=3重播,rc=2战斗播报,直接按播放处理
        } else {
            if (battleData.saveTraffic == 1) { //不看战斗。直接弹出结果面板
                // let function animationComplete()
                //     this.onEndBattle()
                // }
                // let battleProxy = this._battleModule.getProxy(GameProxys.Battle)
                // battleProxy.setCompleteCallback(animationComplete)

                // let battleProxy = this._battleModule.getProxy(GameProxys.Battle)
                // battleProxy.resumeUIAnimation()


                this.onEndBattle()

                return
            }
        }




        this._puppetNum = battle.puppets.lenght
        this._curPuppetIndex = 1
        this._puppets = battle.puppets
        //TODO 可能要一个一个创建出来
        this.delayCreatePuppet(1)
    }


    initBattleView(battle) {
        this._battlePanel.setCurBattle(this)
        mapId = battle.bgIcon
        if (mapId > 105 || mapId < 101) {
            mapId = 101
        }
        this._battlePanel.onUpdateMap(mapId)
        mapId = mapId + 1
        this._battlePanel.onUpdateRound(0)


        let leftHp = 0
        let rightHp = 0

        let type = battle.type
        let isBossBattle = type == 7 || type == 11  //boss战斗，直接写死，血量只加成一个
        let addOne = false

        let puppets = battle.puppets
        for (let key in puppets) {
            let puppet = puppets[key]
            let index = puppet.attr.index
            if (index < 20) {
                leftHp = leftHp + puppet.attr.hp
            } else {
                if (isBossBattle) {
                    if (addOne == false && index == 25) {  //写死BOSS位置为25
                        rightHp = rightHp + puppet.attr.hp
                        addOne = true
                    }
                } else {
                    rightHp = rightHp + puppet.attr.hp
                }
            }
        }


        this._battlePanel.setWarBook(battle)

        this._battlePanel.setMaxHpByCamp(leftHp, BattleCamp.Left)
        this._battlePanel.setMaxHpByCamp(rightHp, BattleCamp.Right)

        //TODO:看看函数参数的battle和this._battleData.battle是否一样
        var battle = this._battleData.battle
        let leftName = battle.leftName
        let rightName = battle.rightName
        this._battlePanel.setNameByCamp(leftName, BattleCamp.Left)
        this._battlePanel.setNameByCamp(rightName, BattleCamp.Right)

        // 显示先手值
        let firstL = battle.firstL || 0
        let firstR = battle.firstR || 0
        this._battlePanel.setFirstByCamp(firstL, BattleCamp.Left)
        this._battlePanel.setFirstByCamp(firstR, BattleCamp.Right)

        // 设置双方的头像
        let headIconL = battle.headIconL || 0
        let headIconR = battle.headIconR || 0

        let playerIdL = battle.headIdL
        let playerIdR = battle.headIdR
        this._battlePanel.setHeadIconByCamp(headIconL, BattleCamp.Left, playerIdL)
        this._battlePanel.setHeadIconByCamp(headIconR, BattleCamp.Right, playerIdR)
        //    let tl = StringUtils.fined64ToAtom(playerIdL)
        //    let tr = StringUtils.fined64ToAtom(playerIdR)
        //    logger.error("=======================================================================>")
        //    logger.error("=======================================================================>")
        //    logger.error("=======================================================================>")
        //    logger.error("====>battle.headIconL:%s, ========>battle.headIconR:%s", headIconL, headIconR)
        //    logger.error("====>battle.headIdL:%s%s, ========>battle.headIdR:%s%s", tl.high, tl.low, tr.high, tr.low)


        let animationComplete = (function () {

            let callback = (function () {
                this.addTimerOnce(30, this.allBirthMove, this)  //门开了，动画开播放
            }).bind(this)

            if (this._battleData.saveTraffic != 1) {
                let ccb = UICCBLayer.new("rgb-duijue", this._battlePanel.getParent(), null, null, true)
                let x, y = NodeUtils.getCenterPosition()
                ccb.setPosition(x + 20, y + 45) //在这里才播放特效
            }

            this._battlePanel.showSkipBtn()
            this._battlePanel.showAccelerateBtn()
            //战斗开始动画影响了UI布局，暂时注释掉//////////////////////////////////-
            //this._battlePanel.playAction("ui_ruchang", callback)
            callback()
            //////////////////////////////////////////////////
            AudioManager.playEffect("battle_start")

            let count = battleCount % 2 + 1
            let soundName = string.format("battle_fb0%d", count)
            soundName = "battle_fb01"
            AudioManager.playMusic(soundName)

        }).bind(this)

        //    animationComplete()
        this._animationComplete = animationComplete

        // let battleProxy = this._battleModule.getProxy(GameProxys.Battle)
        // battleProxy.setCompleteCallback(animationComplete)

        // let battleProxy = this._battleModule.getProxy(GameProxys.Battle)


        let uiParticle = UIParticle.new(this._battlePanel, "huohua")
        let x, y = NodeUtils.getCenterPosition()
        uiParticle.setPosition(x, y)
        this._uiParticle = uiParticle
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

        cc.Director.getScheduler().setTimeScale(1) //战斗结束，重置加速

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

        let mapPanel = this._battleView.getMapPanel()
        let rootNode = mapPanel.getChildByName("indexPanel" + attr.index)

        rootNode.battlePanel = this._battlePanel
        rootNode.battle = this
        let ent = PuppetFactory.getInstance().create(attr, rootNode)

        return ent
    }

    //统一添加定时器入口，跳过时，统一释放掉定时器，以免出现问题
    addTimerOnce(delay, func, obj, arys) {
        TimerManager.addOnce(delay, func, obj, arys)
        table.insert(this._battleTimerList, { func : func, obj : obj })
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
















