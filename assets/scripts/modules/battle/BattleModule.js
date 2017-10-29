/**
 * Created by on 2017/10/14.
 */

import BasicModule from "BasicModule";
import logger from "Logger";

import BattleView from "BattleView";
import BattleStore from "BattleStore";
import BattleAction from "BattleAction";
import BattleActionTypes from "BattleActionTypes";

import AppEvent from "AppEvent";
import GameProxy from "GameProxy";
import GameModule from "GameModule";
import GameConfig from "GameConfig";

import Battle from "Battle";

class BattleModule extends BasicModule {
    constructor(dispatcher) {
        super(dispatcher);
        this._view = null;
    }

    finalize() {
        super.finalize();
    }

    initModule() {
        super.initModule();
        //设置分发监听绑定
        let dispatch = this.getDispatcher();
        let store = new BattleStore(dispatch);
        let action = new BattleAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new BattleView(this, store, action);
        this._view.setModuleName(BattleModule.NAME);
        this._view.showDefaultPanel();

        //战斗处理
        //this._battleHandle = new Battle(action);
    }

    panelActionHandler(type, data) {
        switch (type) {
            case BattleActionTypes.START_BATTLE:
                //战斗处理开始
                //this._battleHandle.startBattle(data);
                break;
        }
    }

    gameActionHandler(event, data) {
        switch (event) {
            case AppEvent.PROXY_BATTLE_START:
                // this.getAction().startBattle()
                // this._battleHandle.startBattle();
                break;
        }
    }

}
BattleModule.NAME = "BattleModule";

export default BattleModule;
