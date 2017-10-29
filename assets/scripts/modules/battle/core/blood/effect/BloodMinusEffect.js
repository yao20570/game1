/**
 * Created by snow on 2016-12-30.
 */
class BloodMinusEffect {
    ctor() {

    }

    finalize() {

    }

    play(node, delay, callback, dir, actionTime, curCount, fCount, hurtType) {
        var complete = function () {
            callback()
        }

        node.setScale(0.5)
        var action1 = cc.scaleTo(actionTime / 4, 0.9)
        var action2 = cc.scaleTo(actionTime / 4 * 3, 1)

        var action = cc.sequence(action1, action2, cc.callFunc(complete))
        node.runAction(action)
    }
}

export default new BloodMinusEffect();
