//module("battleCore", package.seeall)

class Skill {
    constructor(battle) {
        this._owner = null
        this._id = null
        this._targets = null
        this._config = null
        this._round = null
        this._skillEndCallback = null
        this._battle = battle

        this._rootNode = { action: null, nextNode: null }
    }


    init(owner, targets, config, round, callback) {
        this._owner = owner
        this._targets = targets
        this._config = config
        this._round = round
        this._skillEndCallback = callback

        //TODO 不同兵种会不同Action  ,"Move" , "MoveBack"
        // let skillActionKeys = {"Ready", "PreAttack", "Attack", "Battle", "Recover"}
        let skillActionKeys = ["Ready", "PreAttack", "Attack", "Recover"]
        for (key in skillActionKeys) {
            let action = this.getActonByKey(key)
            this.addAction(action)
        }
    }

    use() {
        this.onEnter()
    }

    onEnter() {
        this._curNode = this._rootNode
        this.onEnterAction(this._curNode.action)
    }

    nextAction() {
        this._curNode = this._curNode.nextNode
        if (this._curNode != null) {
            this.onEnterAction(this._curNode.action)
        } else {
            ////} event回合结束
            if (this._skillEndCallback != null) {
                this._skillEndCallback()
            }
        }
    }

    onEnterAction(action) {
        action: onEnter(this)
    }


    addAction(action) {
        if (this._rootNode.action == null) {
            this._rootNode.action = action
        } else {
            let newNode = { action: action, nextNode: null }
            let curNode = this._rootNode
            while (curNode.nextNode != null) {
                curNode = curNode.nextNode
            }
            curNode.nextNode = newNode
        }
    }

    getActonByKey(key) {
        let ActionClass = battleCore[key + "Action"]
        let action = ActionClass.new()
        return action
    }

    getOwner() {
        return this._owner
    }

    getTargets() {
        return this._targets
    }

    getConfig() {
        return this._config
    }

    getRound() {
        return this._round
    }

    getBattle() {
        return this._battle
    }

    addTimerOnce(delay, func, obj, args) {
        this._battle.addTimerOnce(delay, func, obj, args)
    }



}
export default Skill;










