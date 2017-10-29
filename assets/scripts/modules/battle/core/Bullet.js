//module("battleCore", package.seeall)
import UIUtils from "UIUtils"

class Bullet {

    //子弹类
    constructor(attr) {
        this._startPos = attr.startPos
        this._endPos = attr.endPos
        this._callback = attr.callback
        this._typeId = attr.typeId || 1
        this._parent = attr.parent
        this._target = attr.target
        this._atkDir = attr.atkDir
        this._info = attr.info

        this._bulletType = this._info[2]
        this._bulletImg = this._info[3]
        this._speed = tonumber(this._info[4])  //* 10

        this._rootNode = new cc.Node()
        this._parent.addChild(this._rootNode)

        this.launch()
    }

    finalize() {
        this._rootNode.removeFromParent()
        this._rootNode = null
    }

    launch() {

        let bullet = null
        if (this._bulletType == "spine") {
            bullet = SpineEffect.new(this._bulletImg, this._rootNode, true)
            bullet.setDirection(this._atkDir)
        } else {
            bullet = new cc.Node()
            bullet.finalize = function () { }
            this._rootNode.addChild(bullet)
        }

        bullet.setPosition(this._startPos.x, this._startPos.y)
        this._rootNode.setLocalZOrder(1000)

        let callback = (function () {
            this._callback(this._target)
            bullet.finalize()
            this.finalize()
        }).bind(this)

        let dx = this._endPos.x - this._startPos.x
        let dy = this._endPos.y - this._startPos.y
        let s = math.sqrt(dx * dx + dy * dy)
        let time = s / this._speed

        let deg = math.deg(math.atan(dy / dx))
        bullet.setRotation(deg * this._atkDir * -1)

        let moveTo = cc.moveTo(time, cc.p(dx, dy))
        //    let move_ease_out = cc.EaseOut.create(moveTo,2.5)
        let move_ease_out = moveTo //cc.EaseSineOut.create(moveTo)先注释掉缓动
        //备用Action EaseExponentialOut EaseBounceOut EaseBounceInOut 
        //EaseElasticOut EaseBackOut EaseBackInOut 由快到慢缓冲
        let action = cc.sequence(move_ease_out, cc.callFunc(callback))
        this._rootNode.runAction(action)
    }

}

export default Bullet;

