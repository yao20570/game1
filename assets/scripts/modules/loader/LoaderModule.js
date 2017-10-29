
/**
 * Created by on 2017/9/25.
 */

import BasicModule from "BasicModule";

import LoaderView from "LoaderView";
import LoaderStore from "LoaderStore";
import LoaderAction from "LoaderAction";
import LoaderActionTypes from "LoaderActionTypes";

import GameConfig from "GameConfig";
import logger from "Logger";
import AppEvent from "AppEvent";
import GameLayerName from "GameLayerName";

class LoaderModule extends BasicModule {
    constructor(dispatcher) {
        super(dispatcher);
        this._view = null;

        this.__uiLayerName = GameLayerName.uiTopLayer;
    }

    finalize() {
        super.finalize();
    }

    initModule() {
        super.initModule();
        //设置分发监听绑定
        let dispatch = this.getDispatcher();
        let store = new LoaderStore(dispatch);
        let action = new LoaderAction(dispatch);
        this.setAction(action);

        //界面显示
        this._view = new LoaderView(this, store, action);
        this._view.setModuleName(LoaderModule.NAME);
        this._view.showDefaultPanel();

    }

    onShowModule(){
        super.onShowModule();

        
    }

    //模块内通信
    panelActionHandler(type, data) {
        switch (type){
            case LoaderActionTypes.LOADER_START://开始加载
                this.loadStart();
            break;
        }
    }

    //模块之间通信
    gameActionHandler(event, data) {
        switch (event) {
            case AppEvent.LOADER_UPDATE_PROGRESS:
                this.loadProgress(data);//设置层级里的进度
                break;
            
        }
    }

    //开始加载(因为都是异步加载，无法保证加载顺序，必须将loadPanel加载了才开始)
    loadStart(){
        this.sendNotification(AppEvent.LOADER_START);
    }

    //加载进度消息
    loadProgress(data) {
        logger.info("================>预加载进度:%s", data.loadProgress)
        //调用面板的逻辑了
        this.getAction().setProgress(data.loadProgress);
    }

}
LoaderModule.NAME = "LoaderModule";

export default LoaderModule;





