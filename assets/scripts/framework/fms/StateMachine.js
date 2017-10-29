
class StateMachine{
    constructor(owner){
        this._owner = owner
        this._curState = null
    }

    finalize(){

    }

    setCurState(state){
        this._curState = state
    }

    getCurState(){
        return this._curState
    }

    changeState(newState, telegram){        
        if (newState == self._curState){
            return
        }

        this._curState.exit(this._owner, telegram)
        this._curState = newState
        this._curState.enter(this._owner, telegram)
    }

    handleMessage(telegram){

    }
}

export default StateMachine