/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import Battle from "Battle";
import { ModelAnimation, ModelDirection, ModelConsIndex, BattleCamp, HurtType, HurtEffectType, HurtSkillConf } from "BattleConst";
import StringUtils from "StringUtils";

class BattlePanel extends BasicPanel {
    
    constructor(){
        super()
        
        this._maxHpMap = {}
        this._curHpMap = {}
    }

    //panel的初始化，还没能调用action
    initPanel() {
        //let comBg = this.createLv1Bg("战斗")
        //comBg.setImageBg("resources/bg/battle/101/bg.webp")

        this._panelMap = this.getChildByName("panelMap");
        this._panelBg = this.getChildByName("panelBg");

        this._panelTop = this.getChildByName("panelTop");

        this._skipBtn = this.getChildByName("panelDown/skipBtn");
        this._btnAccelerate = this.getChildByName("panelDown/accelerateBtn");
        this._btnWatchName = this.getChildByName("panelDown/watchNameBtn");
    }

    afterinitPanel() {

    }

    //panel的节点事件注册
    registerEvents() {
        this.addTouchUp(this._skipBtn, (this.onSkip).bind(this))
        this.addTouchUp(this._btnAccelerate, (this.onAccelerate).bind(this))
        this.addTouchUp(this._btnWatchName, (this.onWatchName).bind(this))
    }

    onSkip(event) {
        this._battleHandle.onSkipBattle();
    }

    onAccelerate(event) {
        let x = arguments
    }

    onWatchName(event) {
        let x = arguments
    }

    //panel的初始化后，可能调用action了
    afterinitPanel() {
    }

    //打开面板
    onShowHandle() {
        this.getAction().startBattle()
        //战斗处理
        this._battleHandle = new Battle(this);
        this._battleHandle.startBattle()
    }

    //关闭面板
    onHideHandle() {
    }

    ////////////////渲染相关////////////////////////////
    render() {
        this._setBaseInfo()
    }

    //
    _setBaseInfo() {
        //TODO.设置战斗背景
        let battle = this.state.get("battleData")
        if (battle == null) {
            return;
        }

        this._onUpdateMap(battle.bgIcon)

        //设置血量
        let leftHp = 0
        let rightHp = 0

        let type = battle.type
        let isBossBattle = (type == 7 || type == 11)  //boss战斗，直接写死，血量只加成一个
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
                } else { }
                rightHp = rightHp + puppet.attr.hp
            }
        }



        this._setWarBook(battle)

        this._setMaxHpByCamp(leftHp, BattleCamp.Left)
        this._setMaxHpByCamp(rightHp, BattleCamp.Right)

        let leftName = battle.leftName
        let rightName = battle.rightName
        this._setNameByCamp(leftName, BattleCamp.Left)
        this._setNameByCamp(rightName, BattleCamp.Right)

        // 显示先手值
        let firstL = battle.firstL || 0
        let firstR = battle.firstR || 0
        this._setFirstByCamp(firstL, BattleCamp.Left)
        this._setFirstByCamp(firstR, BattleCamp.Right)

        // 设置双方的头像
        let headIconL = battle.headIconL || 0
        let headIconR = battle.headIconR || 0
        let playerIdL = battle.headIdL
        let playerIdR = battle.headIdR
        this._setHeadIconByCamp(headIconL, BattleCamp.Left, playerIdL)
        this._setHeadIconByCamp(headIconR, BattleCamp.Right, playerIdR)
        //    let tl = StringUtils.fined64ToAtom(playerIdL)
        //    let tr = StringUtils.fined64ToAtom(playerIdR)
        //    logger.error("=======================================================================>")
        //    logger.error("=======================================================================>")
        //    logger.error("=======================================================================>")
        //    logger.error("====>battle.headIconL.%s, ========>battle.headIconR.%s", headIconL, headIconR)
        //    logger.error("====>battle.headIdL.%s%s, ========>battle.headIdR.%s%s", tl.high, tl.low, tr.high, tr.low)


        let animationComplete = function () {

            let callback = function () {
                this.addTimerOnce(30, this.allBirthMove, this)  //门开了，动画开播放
            }

            if (this._battleData.saveTraffic != 1) {
                let ccb = UICCBLayer.new("rgb-duijue", this._battlePanel.getParent(), nil, nil, true)
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
        }
        //    animationComplete()
        this._animationComplete = animationComplete

        // let battleProxy = this._battleModule.getProxy(GameProxys.Battle)
        // battleProxy.setCompleteCallback(animationComplete)

        // let battleProxy = this._battleModule.getProxy(GameProxys.Battle)


        // let uiParticle = UIParticle.new(this._battlePanel, "huohua")
        // let x, y = NodeUtils.getCenterPosition()
        // uiParticle.setPosition(x, y)
        // this._uiParticle = uiParticle

    }

    _onUpdateMap(mapId) {
        if (mapId > 105 || mapId < 101) {
            mapId = 101
        }

        let bgType = ".webp"
        let bgurl = StringUtils.format("resources/bg/battle/{1}/bg{2}", mapId, bgType)
        this.setSprite(this._panelBg, bgurl)
    }


    //更新回合
    _onUpdateRound() {
        let roundTxt = this.getChildByName("panelTop/roundTxt")
        this.setLabel(roundTxt, name)
    }

    //设置先手值
    _setFirstByCamp(value, camp) {
        let firstTxt = this.getChildByName("panelTop/first" + camp)
        this.setLabel(firstTxt, value)
    }

    //设置血量
    _setMaxHpByCamp(maxHp, camp) {
        this._maxHpMap[camp] = maxHp
        this._curHpMap[camp] = maxHp

        this._setHpByCamp(maxHp, camp)
        //this.setRedHpByCamp(maxHp, camp)
    }
    _setHpByCamp(hp, camp) {
        let hpTxt = this.getChildByName("panelTop/hpTxt" + camp)
        this.setLabel(hpTxt, hp)

        let hpBar = this.getChildByName("panelTop/hpBar" + camp)
        let maxHp = this._maxHpMap[camp]
        let rate = hp / maxHp * 100
        if (rate < 0) {
            rate = 0
        }
        this.setPercent(hpBar, rate)
    }

    //设置阵营
    _setNameByCamp(name, camp) {
        let nameTxt = this.getChildByName("panelTop/nameTxt" + camp)
        this.setLabel(nameTxt, name)
    }

    //设置头像
    _setHeadIconByCamp() {
        logger.info("_setHeadIconByCamp 需要完善");
    }

    //设置国策
    _setWarBook(battle) {
        logger.info("_setWarBook 需要完善");
    }
}

BattlePanel.NAME = "BattlePanel";
export default BattlePanel;