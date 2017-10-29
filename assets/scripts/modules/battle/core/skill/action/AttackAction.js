//module("battleCore", package.seeall)

import SkillAction from "SkillAction";

class AttackAction extends SkillAction{

    // attackerEnt  进攻方佣兵
    // targetEnt    防守方佣兵
    onEnter(skill) {
        AttackAction.super.onEnter(this, skill)

        this._attackerEnt = skill.getOwner()
        this._battle = skill.getBattle()
        this._attackerType = this._attackerEnt.getModelType()  //攻击方的佣兵类型

        let skillConfig = skill.getConfig()
        this._bulletInfo = skillConfig.bullet           //子弹表现
        this._attackaction = skillConfig.attackaction || {}   //攻击表现
        this._hurtaction = skillConfig.hurtaction || {}       //受击表现
        this._atkaction = skillConfig.atkaction || {}   //攻击战斗特效表现
        this._animationSound = skillConfig.animationSound || {}   //攻击动作音效

        this._hurtEffectCount = 0  //高阶受击特效计数


        let curNum = 0
        let maxNum = 2
        let actionCallback = (function () {
            curNum = curNum + 1
            if (curNum == maxNum) {
                this.endAction()
            }
        }).bind(this)

        let attackEnd = (function () {
            actionCallback()
            //有些模型会死亡，不能直接全部播放特效了。
            this._attackerEnt.playAnimation(ModelAnimation.Wait, true)
        }).bind(this)

        let targets = skill.getTargets()
        this._targets = targets
        this._startHit = false
        let hitCallback = (function () {
            logger.info("===========hitCallback==============")
            skill.getRound().playHitRoleBuffs()
            this.delayLanuchButtle(this._attackerEnt, targets, actionCallback)
        }).bind(this)

        // 攻击动作
        this._attackerEnt.playAnimation(ModelAnimation.Attack, false, attackEnd, "hit", hitCallback)

        // 攻击音效
        this.playAnimationSound(this._attackerEnt, ModelAnimation.Attack, this._animationSound)


        this.consiAttackAction(this._attackerEnt)


        //TODO 这里需要打击帧 进行发射
        this.skill.addTimerOnce(1000, this.delayLanuchButtle, this, this._attackerEnt, targets, actionCallback)

    }

    // 根据佣兵类型和模型动作，播放音效
    playAnimationSound(ent, animationName, skillConfig) {
        if (ent == null || animationName == null || skillConfig == null) {
            return
        }

        for (let key in skillConfig) {
            let soundInfo = skillConfig[key]
            if (soundInfo[1] == animationName) {
                // print("== // 根据佣兵类型和模型动作，播放音效 ==")
                this.actionEffect(ent, [soundInfo[2], soundInfo[3], soundInfo[4]])
                return
            }
        }

    }


    //军师播放攻击动作
    // 根据当前佣兵所在阵营判定播放
    consiAttackAction(curEnt) {
        // let dir = curEnt.getDirection()
        let dir = curEnt.getDirFromExchangeCamp()
        let consIndex
        if (dir == ModelDirection.Right) { //左边军师
            consIndex = ModelConsIndex.Left
        } else if (dir == ModelDirection.Left) { //右边军师
            consIndex = ModelConsIndex.Right
        }
        let consiEnt = PuppetFactory.getInstance().getEntity(consIndex)
        if (consiEnt) {
            let attackCallBack = (function () {
                consiEnt.playAnimation(ModelAnimation.Wait, true)
            }).bind(this)
            consiEnt.playAnimation(ModelAnimation.Attack, false, attackCallBack)
        }
    }

    attackEffect(ent, effectInfos, playSound) {
        for (let key in effectInfos) {
            let effectInfo = effectInfos[key]
            if (effectInfo[1] == "sound" && playSound == true) {
                this.actionEffect(ent, effectInfo) //callback
            } else if (effectInfo[1] != "sound") {
                this.actionEffect(ent, effectInfo) //callback
            }
        }
    }

    delayLanuchButtle(attackerEnt, targets, actionCallback) {
        if (this._startHit == true) {  //兼容
            return
        }
        this._startHit = true
        this.lanuchButtle(attackerEnt, targets, actionCallback)

        this.attackEffect(attackerEnt, this._attackaction, true)

        this.launchAtkAction(attackerEnt, this._atkaction, targets, true)  //新增战斗特效
    }

    //发射子弹
    lanuchButtle(attackerEnt, targets, actionCallback) {
        this._hurtEffectCount = 0
        let curNum = 0
        let maxNum = targets.lenght
        let hurtCallback = function () {
            curNum = curNum + 1
            if (curNum == maxNum) {  //整个攻击，受击结束
                actionCallback()
            }
        }

        let isPlaySound = true
        //攻击飘血频率 由子弹配置决定
        let lanuchCallback = (function (target) {
            this.beHurt(target, hurtCallback, this._bulletInfo[5],
                this._bulletInfo[6], this._bulletInfo[7], this._bulletInfo[8], isPlaySound)
            //子弹运行到，受击播放
            isPlaySound = false
        }).bind(this)

        this._dir = attackerEnt.getDirection()

        let mapPanel = attackerEnt.getMapPanel()

        for (let key in targets) {
            let target = targets[key]
            let targetEnt = PuppetFactory.getInstance().getEntity(target.index)
            if (targetEnt != null) {
                logger.info("发射子弹index=%d", target.index)

                let attr = {}
                attr.startPos = cc.p(attackerEnt.getCenterPosition())
                attr.endPos = cc.p(targetEnt.getCenterPosition())
                attr.callback = lanuchCallback
                attr.parent = mapPanel
                attr.target = target
                attr.atkDir = attackerEnt.getDirection()
                attr.info = this._bulletInfo
                Bullet.new(attr)
            }
        }
    }


    // // 受击表现
    // beHurt(target, callback, fCount, fsecond, delayDeath,delayHurt, isPlaySound)
    //     let ent = PuppetFactory.getInstance().getEntity(target.index)
    //     if( ent == null ){ //战斗已经结束了。不要回调了
    //         return
    //     }

    //     // 受击动作+扣血
    //     ent.beHurt(target.bloods, target.num, callback, fCount, fsecond, delayDeath,delayHurt)

    //     // 受击特效
    //     this.attackEffect(ent, this._hurtaction, isPlaySound)
    // }


    // 受击表现
    beHurt(target, callback, fCount, fsecond, delayDeath, delayHurt, isPlaySound) {
        let ent = PuppetFactory.getInstance().getEntity(target.index)
        if (ent == null) { //战斗已经结束了。不要回调了
            return
        }

        // 受击动作+扣血
        ent.beHurt(target.bloods, target.num, callback, fCount, fsecond, delayDeath, delayHurt)


        // let isPlayEffect = false
        // let size = table.size(this._targets)
        // let attackerType = this._attackerType  % 100
        // let index = target.index % 10
        // logger.info("受击特效判定 size,attackerType,index =%d %d %d",size,attackerType,index) //3.109.24=3.9.4

        // 暂时屏蔽高阶受击处理
        // if( attackerType > 5 && size > 0 ){
        //     //高阶兵才处理
        //     let data = {}
        //     let parent = null
        //     let camp = 1  //1=left 2=right
        //     let dir = ModelDirection.Left
        //     if( target.index < 20 ){
        //         camp = 1
        //         dir = ModelDirection.Right
        //     else
        //         camp = 2
        //         dir = ModelDirection.Left
        //     }

        //     if( index >=1 && index <= 3 ){  //前排
        //         isPlayEffect = true
        //     } else if ( index >=4 && index <= 6 ){  //后排
        //         isPlayEffect = true
        //     }

        //     if( isPlayEffect ){
        //         if( this._hurtEffectCount == 0 ){  //只在指定位置播放一次受击特效
        //             this._hurtEffectCount = this._hurtEffectCount + 1
        //             data.dir = dir
        //             data.camp = camp
        //             data.index = index

        //             // 高阶受击表现
        //             this.attackEffect2(ent, this._hurtaction, isPlaySound,data)
        //         }
        //         return            
        //     }
        // }

        // 低阶受击表现
        this.attackEffect(ent, this._hurtaction, isPlaySound)
    }

    // 判断是否高阶
    targetAtkAction(target) {
        // body

        let isPlayEffect = false
        let data = {}
        let parent = null
        let camp = 1  //1=left 2=right
        let dir = ModelDirection.Left

        let size = table.size(this._targets)
        let attackerType = this._attackerType % 100
        let index = target.index % 10
        logger.info("判定 size,attackerType,index =%d %d %d", size, attackerType, index) //3.109.24=3.9.4


        if (this._attackerType > 500) {
            attackerType = 6   //boss模型当高阶兵处理
        }


        // 暂时屏蔽高阶受击处理
        if (attackerType > 5 && size > 0) {
            //高阶兵才处理
            if (target.index < 20) {
                camp = 1
                dir = ModelDirection.Right
            } else {
                camp = 2
                dir = ModelDirection.Left
            }

            if (index >= 1 && index <= 3) {  //前排
                isPlayEffect = true
            } else if (index >= 4 && index <= 6) {  //后排
                isPlayEffect = true
            }
        }

        data.dir = dir
        data.camp = camp
        data.index = index

        return isPlayEffect, data
    }


    ////////////////////////////////////////////////////////////////////////////////////////-
    ////////////////////////////////////////////////////////////////////////////////////////-
    // 高阶受击表现
    ////////////////////////////////////////////////////////////////////////////////////////-
    ////////////////////////////////////////////////////////////////////////////////////////-
    attackEffect2(ent, effectInfos, playSound, parent) {
        for (let key in effectInfos) {
            let effectInfo = effectInfos[key]
            if (effectInfo[1] == "sound" && playSound == true) {
                this.actionEffect2(ent, effectInfo, null, parent) //callback
            } else if (effectInfo[1] != "sound") {
                this.actionEffect2(ent, effectInfo, null, parent) //callback
            }
        }
    }

    actionEffect2(ent, effectInfo, callback, data) {
        let type = effectInfo[1]
        if (type == "effect") {
            let effectName = effectInfo[2]
            let rootNode = this.dealEffectData(effectName, data)
            if (rootNode != null) {
                this.playEffect2(effectName, effectInfo[3], effectInfo[4], rootNode)   //创建高阶受击特效
            } else {
                ent.playEffect(effectName, effectInfo[3], effectInfo[4])   //创建低阶受击特效
            }
        } else if (type == "characterColor") {
            ent.characterColor(effectInfo[4], effectInfo[5], effectInfo[6])
        } else if (type == "sound") {
            this.playSound(effectInfo[2])
        } else if (type == "backgroundColor") {
            let time = (effectInfo[3] - effectInfo[2]) / 100
            ent.backgroundColorAction(effectInfo[4], effectInfo[5], effectInfo[6], effectInfo[7], time)
        } else if (type == "formationtab") {
            ent.changeZhenfa(tonumber(effectInfo[2]), effectInfo[3], callback)   //改变阵法
        }
    }

    // 创建高阶受击特效
    playEffect2(effectName, dx, dy, parent) {
        let spineEffect = SpineEffect.new(effectName, parent)
        spineEffect.setPosition(dx * 1 + 50, dy + 50)  //50写死。居中处理。 * this._curDir
        spineEffect.setLocalZorder(1000)

        spineEffect.setDirection(parent.dir)

        logger.info("高阶特效 effectName,dx,dy,dir=%s,%d,%d,%d", effectName, dx, dy, parent.dir)
    }

    // 判定高阶受击特效的播放坑位
    dealEffectData(effectName, data) {
        // body
        let parent = null
        let conf = this.getSkillConfByName(effectName)
        if (conf != null) {
            let index = data.index
            for (let key in conf.indexMaps) {
                let indexMap = conf.indexMaps[key]
                if (index >= indexMap[2] && index <= indexMap[3]) {
                    let battleView = this._battle.getBattleView()
                    let mapPanel = battleView.getMapPanel()
                    parent = mapPanel.getChildByName("indexPanel" + indexMap[1] + data.camp)
                    parent.setVisible(true)
                    parent.dir = data.dir
                    parent.setLocalZorder(1000)
                    return parent
                }
            }
        }

        return parent
    }


    // 根据特效名字获取受击特效配表信息
    getSkillConfByName(effectName) {
        // body

        // 高阶兵种受击特效
        // {'A',1,3} . 'A'=播放位置，1=坑位1，3=坑位3 +(即前排还有敌人(受击坑位含有1~3之一)，则在A位置播放特效effect="bu06_hit")
        // {'B',4,6} . 'B'=播放位置，1=坑位1，3=坑位3 +(即后排还有敌人(受击坑位含有4~6之一)，则在B位置播放特效effect="bu06_hit")
        // defaultDir=1 . 特效资源的方向朝向

        // let skillConf = {}
        // skillConf[1] = {ID = 1, effect="bu06_hit", defaultDir=1, indexMaps={{'A',1,3},{'B',4,6}}}  
        // skillConf[2] = {ID = 2, effect="gong06_hit", defaultDir=1, indexMaps={{'C',1,6}}}  
        // skillConf[3] = {ID = 3, effect="qiang06_hit", defaultDir=1, indexMaps={{'D',1,1},{'D',4,4},{'E',2,2},{'E',5,5},{'F',3,3},{'F',6,6}}}  
        // skillConf[4] = {ID = 4, effect="qi01_atk", defaultDir=1, indexMaps={{'A',1,3},{'B',4,6}}}
        let skillConf = HurtSkillConf

        for (let key in skillConf) {
            let v = skillConf[key]
            if (v.effect == effectName) {
                return v
            }
        }
        return null
    }

    ////////////////////////////////////////////////////////////////////////////////////////-
    ////////////////////////////////////////////////////////////////////////////////////////-
    // 高阶攻击特效
    ////////////////////////////////////////////////////////////////////////////////////////-
    ////////////////////////////////////////////////////////////////////////////////////////-
    launchAtkAction(attackerEnt, effectInfos, targets, playSound) {
        // body
        let size = table.size(targets)
        if (size > 0) {
            let target = targets[1]
            let isPlayEffect, data = this.targetAtkAction(target)
            if (isPlayEffect == true && data != null) {
                logger.info("准备要播高阶的攻击特效啦++. 000")
                this.attackEffect3(attackerEnt, effectInfos, playSound, data)  //高阶攻击特效
            }
        }

    }

    attackEffect3(ent, effectInfos, playSound, parent) {
        for (let key in effectInfos) {
            let effectInfo = effectInfos[key]
            if (effectInfo[1] == "sound" && playSound == true) {
                this.actionEffect3(ent, effectInfo, null, parent) //callback
            } else if (effectInfo[1] != "sound") {
                this.actionEffect3(ent, effectInfo, null, parent) //callback
            }
        }
    }

    actionEffect3(ent, effectInfo, callback, data) {
        let type = effectInfo[1]
        if (type == "effect") {
            logger.info("准备要播高阶的攻击特效啦++. A1")
            let effectName = effectInfo[2]
            let rootNode = this.dealEffectData3(effectInfo[6], data)
            if (rootNode != null) {
                logger.info("准备要播高阶的攻击特效啦++. A2")

                if (effectInfo[5] > 0) {
                    logger.info("== 延时 播高阶的攻击特效++. A2")
                    this.skill.addTimerOnce(effectInfo[5], this.playEffect3, this, effectName, effectInfo[3], effectInfo[4], rootNode)
                } else {
                    logger.info("播高阶的攻击特效++. A2")
                    this.playEffect3(effectName, effectInfo[3], effectInfo[4], rootNode)   //创建高阶攻击特效
                }

            }
        } else if (type == "characterColor") {
            ent.characterColor(effectInfo[4], effectInfo[5], effectInfo[6])
        } else if (type == "sound") {
            // this.playSound(effectInfo[2])
            this.actionEffect(ent, effectInfo, null)

        } else if (type == "backgroundColor") {
            let time = (effectInfo[3] - effectInfo[2]) / 100
            ent.backgroundColorAction(effectInfo[4], effectInfo[5], effectInfo[6], effectInfo[7], time)
        } else if (type == "formationtab") {
            ent.changeZhenfa(tonumber(effectInfo[2]), effectInfo[3], callback)   //改变阵法
        }
    }

    // 创建高阶攻击特效
    playEffect3(effectName, dx, dy, parent) {
        let spineEffect = SpineEffect.new(effectName, parent)
        spineEffect.setPosition(dx * 1 + 50, dy + 50)  //50写死。居中处理。 * this._curDir
        spineEffect.setLocalZorder(1000)
        spineEffect.setDirection(parent.dir)

        logger.info(" ok 高阶攻击特效 effectName,dx,dy,dir=%s,%d,%d,%d", effectName, dx, dy, parent.dir)
    }

    // 判定高阶攻击特效的播放坑位
    dealEffectData3(showType, data) {
        // body
        let parent = null
        let conf = this.getSkillConfByName3(showType)
        if (conf != null) {
            let index = data.index
            for (let key in conf.indexMaps) {
                let indexMap = conf.indexMaps[key]
                if (index >= indexMap[2] && index <= indexMap[3]) {
                    logger.info("判定高阶特效的播放坑位 ++. B")
                    let battleView = this._battle.getBattleView()
                    let mapPanel = battleView.getMapPanel()
                    parent = mapPanel.getChildByName("indexPanel" + indexMap[1] + data.camp)
                    parent.setVisible(true)
                    parent.dir = data.dir
                    parent.setLocalZOrder(1000)
                    return parent
                }
            }
        }

        return parent
    }

    // FightShowConfig effectInfo[6] 表示坑位

    // 根据特效名字获取攻击特效配表信息
    getSkillConfByName3(showType) {
        // body

        // 高阶兵种特效
        // {'A',1,3} . 'A'=播放位置，1=坑位1，3=坑位3 +(即前排还有敌人(受击坑位含有1~3之一)，则在A位置播放特效effect="bu06_hit")
        // {'B',4,6} . 'B'=播放位置，1=坑位1，3=坑位3 +(即后排还有敌人(受击坑位含有4~6之一)，则在B位置播放特效effect="bu06_hit")

        let skillConf = HurtSkillConf
        for (let key in skillConf) {
            let v = skillConf[key]
            if (v.showType == showType) {
                return v
            }
        }
        return null
    }



}

export default new AttackAction();
