/**
 * Created by snow on 2016-12-30.
 */
class BloodRateEffect {
    ctor() {

    }

    finalize() {
        this.callback = null;
    }

    play(node, delay, callback, dir, actionTime, curCount, fCount, hurtType) {
        var self = this;
        self.callback = callback
        dir = dir || 1
        self._actionTime = actionTime || 1.2
        node.setVisible(true)
        self.round1(node, delay, dir)
    }

    round1(node, delay, dir) {
        var self = this;
        var pos = node.getPosition()
        node.setVisible(false)

        var round2 = function () {
            self.round2(node, dir)
        }

        var visible = function () {
            node.setVisible(true)
        }

        var endAction = function () {
            self.endAction(node)
        }

        var scaleTo = cc.scaleTo(self._actionTime, 2)
        var action = cc.sequence(cc.delayTime(delay), cc.callFunc(visible), scaleTo, cc.callFunc(endAction))
        node.runAction(action)
    }

    round2(node, dir) {
        var self = this;
        var pos = node.getPosition()

        var endAction = function () {
            self.endAction(node)
        }

        var move = cc.moveTo(self._actionTime / 4 * 3, cc.p(pos.x, pos.y + 75 * dir))
        var fadeTo = cc.fadeTo(self._actionTime / 4 * 3, 0)
        var spawn = cc.spawn(move, fadeTo)
        var action = cc.sequence(spawn, cc.callFunc(endAction))

        node.runAction(action)
    }

    endAction() {
        if (this.callback) {
            this.callback();
        }
        this.finalize()
    }
}
