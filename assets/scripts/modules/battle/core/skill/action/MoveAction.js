//module("battleCore", package.seeall)
import SkillAction from "SkillAction";

class MoveAction {

    onEnter(skill) {
        super.onEnter(skill)

        this._attackerEnt = skill.getOwner()
        // this._dir = this._attackerEnt.getDirection()
        this._dir = this._attackerEnt.getDirFromExchangeCamp()  //根据阵营转为朝向

        let targets = skill.getTargets()
        let target = targets[1]

        let targetEnt = PuppetFactory.getInstance().getEntity(target.index)
        //朝这方向移动
        let x, y = targetEnt.getPosition()

        this._attackerEnt.moveTo(cc.p(x + this._dir * 100, y), 400, (this.moveEnd).bind(this))
    }


    moveEnd() {
        this.endAction()
    }
}

export default new MoveAction();

