/**
 * Created by snow on 2016-12-30.
 */
class BloodRefrainEffect {
    ctor() {

    }

    finalize() {

    }

    play(node, delay, callback, dir, actionTime, curCount, fCount, hurtType) {
        var self = this;
        var complete = function () {
            callback();
        }

        // 数字标签动画
        var action1 = cc.scaleTo(actionTime / 4, 0.9)
        var action2 = cc.scaleTo(actionTime / 4 * 3, 1)
        var action = cc.sequence(action1, action2, cc.callFunc(complete))

        var number = node.getChildByTag(hurtType)
        number.setScale(0.5)
        number.runAction(action)

        // 文字动画：播一次
        if (curCount == 2) {
            self.playTxtAction(node, number, actionTime, fCount)
        }
    }

    playTxtAction(node, number, actionTime, fCount) {
        var self = this;
        var resTab = node.resTab
        if (resTab) {
            if (fCount > 1) {
                actionTime = fCount * actionTime
            }

            // actionTime : 飘字总时间

            // 背景
            var spawn1 = cc.spawn(cc.rotateTo(actionTime / 2, 180), cc.fadeTo(actionTime / 4, 100), cc.scaleTo(actionTime / 4, 1.2))
            var spawn2 = cc.spawn(cc.fadeTo(actionTime / 2, 255), cc.scaleTo(actionTime / 4, 1.0))
            var action1 = cc.sequence(spawn1, spawn2)

            // 克制
            var delay2 = cc.delayTime(actionTime / 4)
            var spawn3 = cc.spawn(cc.fadeTo(actionTime / 2, 150), cc.scaleTo(actionTime / 4, 2.0))
            var spawn4 = cc.spawn(cc.fadeTo(actionTime / 2, 255), cc.scaleTo(actionTime / 4, 1.0))
            var action2 = cc.sequence(delay2, spawn3, spawn4)


            var pos = number.getPosition()          //参考坐标：数字
            var resPos = [[0, 40, action1, -16.15], [0, 40, action2, -8.56]];   //相对坐标：背景、克制

            for (var i = 0; i < resTab.length; i++) {
                var eff = node.getChildByName(resTab[i])
                eff.setPosition(cc.p(pos.x + resPos[i][0], pos.yy + resPos[i][1]))
                eff.setRotation(resPos[i][3])
                eff.runAction(resPos[i][2])
            }
        }
    }
}

export default new BloodRefrainEffect();
