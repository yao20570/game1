//module("battleCore", package.seeall)
import SkillAction from "SkillAction";

class ReadyAction extends SkillAction {

    onEnter(skill) {
        super.onEnter(this, skill)

        this._attackerEnt = skill.getOwner()
        //先变阵
        let skillConfig = skill.getConfig()

        let callback = (function () {
            this.endAction()
        }).bind(this)

        let readyaction = skillConfig.readyaction
        this.skillEffect(this._attackerEnt, readyaction, callback)
    }

    skillEffect(ent, effectInfos, callback) {
        for (let key in effectInfos) {
            let effectInfo = effectInfos[key]
            this.actionEffect(ent, effectInfo, callback) //
        }
    }
}

export default new ReadyAction();
