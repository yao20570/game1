//module("battleCore", package.seeall)

import SkillAction from "SkillAction";

//预攻击、蓄力阶段
class reAttackAction extends SkillAction {
    onEnter(skill) {
        super.onEnter(this, skill)

        let callback = (function () {
            this.endAction()
        }).bind(this)

        this._attackerEnt = skill.getOwner()
        //先变阵
        let skillConfig = skill.getConfig()


        callback()
        let preattackaction = skillConfig.preattackaction || {}
        this.skillEffect(this._attackerEnt, preattackaction, callback)

    }

    skillEffect(ent, effectInfos, callback) {
        for (let key in effectInfos) {
            let effectInfo = effectInfos[key]
            this.actionEffect(ent, effectInfo, callback) //
        }
    }
}

export default new reAttackAction();
