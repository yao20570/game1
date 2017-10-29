import SkillAction from "SkillAction";

class RecoverAction extends SkillAction{
    onEnter(skill){
        super.onEnter(this, skill)
        
        this._attackerEnt = skill.getOwner()
        //阵法还原
    
        let callback = (function(){
            this.endAction()
        }).bind(this)
    
        let defaultZhenfa = this._attackerEnt.getDefaultZhenfa()
        this._attackerEnt.changeZhenfa(defaultZhenfa, 200, callback)
    }
}

export default new RecoverAction();
