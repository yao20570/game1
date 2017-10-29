//module("battleCore", package.seeall)

class SkillAction {

    constructor() {

    }

    onEnter(skill) {
        self.skill = skill
    }

    actionEffect(ent, effectInfo, callback) {
        let type = effectInfo[1]
        if (type == "effect") {

            // let effectName = effectInfo[2]
            // ent.playEffect(effectName, effectInfo[3], effectInfo[4], effectInfo[5])   //创建并播放特效(攻击/受击/)   callback参数其实没有用到

            if (effectInfo[5] > 0) {
                self.skill.addTimerOnce(effectInfo[5], self.delayPlayEffect, self, effectInfo[2], effectInfo[3], effectInfo[4], effectInfo[5], ent)
            } else {
                ent.playEffect(effectInfo[2], effectInfo[3], effectInfo[4], effectInfo[5])   //创建并播放特效(攻击/受击/)   callback参数其实没有用到
            }


        } else if (type == "characterColor") {
            ent.characterColor(effectInfo[4], effectInfo[5], effectInfo[6])
        } else if (type == "sound") {
            if (effectInfo[3] != null && effectInfo[3] > 0) {
                self.skill.addTimerOnce(effectInfo[3], self.delayPlaySound, self, effectInfo[2], effectInfo[3])
            } else {
                self.playSound(effectInfo[2])
            }

        } else if (type == "backgroundColor") {
            let time = (effectInfo[3] - effectInfo[2]) / 100
            ent.backgroundColorAction(effectInfo[4], effectInfo[5], effectInfo[6], effectInfo[7], time)
        } else if (type == "formationtab") {
            ent.changeZhenfa(tonumber(effectInfo[2]), effectInfo[3], callback)   //改变阵法
        }
    }

    // 延时播放特效
    delayPlayEffect(effectName, dx, dy, delay, parent) {
        logger.info("== 00 延时播放特效 name.%s, delay.%s ==", effectName, delay)
        parent.playEffect(effectName, dx, dy, delay)
    }

    // 延时播放音效
    delayPlaySound(name) {
        // logger.info("== 00 延时播放音效 name.%s,delay.%s ==",name,delay)
        self.playSound(name)
    }

    playSound(name) {
        AudioManager.playEffect(name)
    }

    endAction() {
        // TimerManager.addOnce(100, self.delayNextAction, self)
        self.skill.addTimerOnce(100, self.delayNextAction, self)
    }

    delayNextAction() {
        self.skill.nextAction()
    }
}

export default SkillAction;
