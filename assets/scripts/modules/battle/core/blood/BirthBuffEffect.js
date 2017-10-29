//module("battleCore", package.seeall)
class BirthBuffEffect {

    finalize() {
        this.callback = nil;
    }

    play(node, delay, callback, dir, actionTime) {
        this.callback = callback;

        dir = dir || 1;
        this._actionTime = actionTime || 1.2;
        node.active = true;
        this.round1(node, delay, dir);
    }

    round1(node, delay, dir) {
        let self = this;
        let pos = node.getPosition();
        node.setVisible(false);

        let round2 = function() {
            self.round2(node, dir);
        }

        let visible = function() {
            node.setVisible(true);
        }

        node.setScale(0.1);
        let move = cc.moveTo(self._actionTime / 4, cc.p(pos.x, pos.y + 28 * dir));
        let scaleAction = cc.scaleTo(self._actionTime / 4, 1);
        let spawn = cc.spawn(move, scaleAction)
        let action = cc.sequence([cc.delayTime(delay) ,
            cc.callFunc(visible), spawn, cc.callFunc(round2)]);
        node.runAction(action)
    }


    round2(node, dir) {
        let self = this;
        let pos = node.getPosition();

        let endAction = function() {
            self.endAction(node);
        }
        let move = cc.moveTo(self._actionTime / 4 * 3, cc.p(pos.x  , pos.y + 75* dir));
        let fadeTo = cc.fadeTo(self._actionTime / 4 * 3, 0);
        let spawn = cc.spawn(move, fadeTo);
        let action = cc.sequence(spawn, cc.callFunc(endAction));
        node.runAction(action);
    }


    endAction(node) {
        let self = this;
        if(self.callback){
            self.callback();
        }
        self.finalize();
    }

}

export default new BirthBuffEffect();
