import BasicAction from "BasicAction";
import GameProxy from "GameProxy";
import BattleActionTypes from "BattleActionTypes";

export default class BattleAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(BattleActionTypes.SHOW_OTHER_EVENT, data)
    }

    startBattle(){
        let battleProxy = this.getProxy(GameProxy.Battle)
        let curBattleData = battleProxy.getCurBattleData()

        this.dispatch(BattleActionTypes.START_BATTLE, curBattleData)
    }

    // setBattleData(data){
    //      this.dispatch(BattleActionTypes.SET_DATA_BATTLEDATA, data)
    // }

    //设置回合
    setRoundNum(num){
        this.dispatch(BattleActionTypes.SET_ROUND_NUM, num)
    }

    
}