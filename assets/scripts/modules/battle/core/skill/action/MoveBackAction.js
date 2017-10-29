//module("battleCore", package.seeall)
import SkillAction from "SkillAction";

class MoveBackAction extends SkillAction {
    onEnter(skill) {
        super.onEnter(this, skill)

        this._attackerEnt = skill.getOwner()
        let pos = this._attackerEnt.getSpawPos()

        this._attackerEnt.moveTo(pos, 400, (this.moveEnd).bind(this))
    }

    moveEnd() {
        this.endAction()
    }
}

export default new MoveBackAction()