//module("battleCore", package.seeall)

class Round {

    constructor(round, battle) {
        this._round = round
        this._battle = battle
        this._attacker = PuppetFactory.getInstance().getEntity(round.index)
    }

    startRound() {
        this.playRoleBuffs(this._round.startRoleBuffs)
        this.useSkill(this._round.skillId)
    }

    useSkill(skillId) {
        logger.info("=//index.%d////-useSkill(%d)//////////", this._round.index, skillId)
        let skillEndCallback = function () {
            this.endRound()
        }

        if (skillId == 0) {  //该回合没有释放技能
            skillEndCallback()
            return
        }

        let reliefModelType = this._attacker.getReliefModelType()
        if (reliefModelType != nil) {
            skillId = reliefModelType //现在的默认技能ID是跟模型一样的，当不一样时，就需要修改！！
        }
        let config = ConfigDataManager.getConfigById(ConfigData.FightShowConfig, skillId)
        let skill = Skill.new(this._battle)
        skill.init(this._attacker, this._round.targets, config, self, skillEndCallback)
        skill.use()
    }


    endRound() {
        this.playRoleBuffs(this._round.endRoleBuffs)
        this.nextRound()
    }

    playHitRoleBuffs() {
        this.playRoleBuffs(this._round.hitRoleBuffs)
    }

    playRoleBuffs(roleBuffs) {
        logger.info("~~~~~~~~roleBuffs~~~~~~~", roleBuffs.lenght)

        //测试数据
        //    roleBuffs ={
        //        {
        //            index = 21,
        //	        buffs = {
        //	            {
        //                    id = 1403,
        //	                lastRound = 2,
        //	                iconId = 3
        //                }
        //            },
        //	        attrMaps = {
        //                {
        //                    key = 1,
        //	                value = 99999,
        //	                delta = 30,
        //	                num = 666666,
        //                }
        //            }
        //        },
        //        {
        //            index = 23,
        //	        buffs = {
        //	            {
        //                    id = 1403,
        //	                lastRound = 2,
        //	                iconId = 3
        //                }
        //            },
        //	        attrMaps = {
        //                {
        //                    key = 1,
        //	                value = 99999,
        //	                delta = 30,
        //	                num = 666666,
        //                }
        //            }
        //        }

        //    }



        // buff效果动画
        for (let key in roleBuffs) {
            this.playRoleBuff(roleBuffs[key])
        }

    }

    playRoleBuff(roleBuff) {
        let puppet = PuppetFactory.getInstance().getEntity(roleBuff.index)
        if (puppet) {

            puppet.updateBuffCCBList(roleBuff.buffs)

            // 属性变化效果
            for (let key in roleBuff.attrMaps) {
                let attrMap = roleBuff.attrMaps[key]
                let key = attrMap.key
                let value = attrMap.value
                let delta = attrMap.delta

                // buff的血量变化
                if (key == 2) {
                    let hurtType = HurtType.NormalHurt
                    if (delta > 0) {
                        hurtType = HurtType.AddHpHurt
                    }
                    delta = - delta

                    let bloods = {}
                    let blood = { state : hurtType, delta : delta }
                    table.insert(bloods, blood)
                    puppet.beHurt(bloods, attrMap.num, nil, 6, [ 25, 30, 35, 40, 45, 50 ], 2, 1.5)
                } else {
                    // TODO.其它属性变化特效
                }
            }
        }
    }

    nextRound() {
        // TimerManager.addOnce(100, this.delayRound,self)
        this._battle.addTimerOnce(100, this.delayRound, self)
    }

    delayRound() {
        this._battle.nextRound()
    }














}

export default Round;
