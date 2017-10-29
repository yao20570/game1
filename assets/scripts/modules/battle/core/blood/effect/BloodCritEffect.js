/**
 * Created by snow on 2016-12-30.
 */
class BloodCritEffect {
    constructor() {

    }

    finalize() {

    }

    play(node, delay, callback, dir, actionTime, curCount, fCount, hurtType) {
        let self = this;
        let complete = function () {
            callback()
        }

        let action1 = cc.scaleTo(actionTime / 4, 0.9)
        let action2 = cc.scaleTo(actionTime / 4 * 3, 1)
        let action = cc.sequence(action1, action2, cc.callFunc(complete))

        let number = node.getChildByTag(hurtType)
        number.setScale(0.5)
        number.runAction(action)

        if (curCount == 2) {
            self.playTxtAction(node, number, actionTime, fCount)
        }
    }

    playTxtAction(node, number, actionTime, fCount) {
        let resTab = node.resTab;
        if (resTab) {
            if (fCount > 1) {
                actionTime = fCount * actionTime
            }

            // 背景
            let spawn1 = cc.spawn(cc.fadeTo(actionTime / 4, 100), cc.scaleTo(actionTime / 6, 1.2))
            let spawn2 = cc.spawn(cc.fadeTo(actionTime / 4, 255), cc.scaleTo(actionTime / 6, 1.0))
            let action1 = cc.sequence(spawn1, spawn2)

            // 暴
            let delay2 = cc.delayTime(actionTime / 2)
            let spawn3 = cc.spawn(cc.fadeTo(actionTime / 3, 150), cc.scaleTo(actionTime / 4, 2.0))
            let spawn4 = cc.spawn(cc.fadeTo(actionTime / 3, 255), cc.scaleTo(actionTime / 4, 1.0))
            let action2 = cc.sequence(delay2, spawn3, spawn4)

            // 击
            let delay3 = cc.delayTime(actionTime * 1 / 1.5)
            let spawn5 = cc.spawn(cc.fadeTo(actionTime / 3, 150), cc.scaleTo(actionTime / 4, 2.0))
            let spawn6 = cc.spawn(cc.fadeTo(actionTime / 3, 255), cc.scaleTo(actionTime / 4, 1.0))
            let action3 = cc.sequence(delay3, spawn5, spawn6)


            let pos = number.getPosition()          //参考坐标：数字
            let resPos = [[0, 40, action1], [-12, 40, action2], [12, 44, action3]]   //相对坐标：背景、暴、击

            for (let i = 0; i < resTab.length; i++) {
                let eff = node.getChildByName(resTab[i])
                eff.setPosition(cc.p(pos.x + resPos[i][0], pos.y + resPos[i][1]))
                eff.runAction(resPos[i][2])
            }
        };
    }
}
