/**
 * 基础模块
 */

import GameLayerName from "GameLayerName";

class BasicModule {
    constructor(dispatcher) {
        this._dispatcher = dispatcher;

        this._gameState = null;
        this._rootNode = null;

        this._action = null;

        this.__uiLayerName = GameLayerName.ui3Layer;

        this._dispatchToken = dispatcher.register((payload) => {
            this.__invokeOnDispatch(payload);
        });
    }

    finalize() {

    }

    getDispatcher(){
        return this._dispatcher;
    }

    setAction(action){
        this._action = action;
        this._action.setModule(this);
    }

    getAction(){
        return this._action;
    }

    setGameState(state) {
        this._gameState = state;
    }

    getGameState() {
        return this._gameState;
    }

    getProxy(proxyName) {
        return this._gameState.getProxy(proxyName);
    }

    sendNotification(event, data) {
        this._gameState.sendNotification(event, data);
    }

    showModule() {
        if (this._rootNode == null) {
            this._rootNode = new cc.Node();
            this.addToLayer();

            this.initModule();
        }

        this.setActive(true);
        this.onShowModule();
    }

    addToLayer() {
        this._gameState.addToLayer(this.__uiLayerName, this._rootNode);
    }

    getLayer(layerName){
        return this._gameState.getLayer(layerName);
    }

    hideModule() {
        if(this._rootNode == null){
            return;
        }
        this.setActive(false);

        this.onHideModule();
    }

    onShowModule() {

    }

    onHideModule() {
    }

    initModule() {

    }

    setActive(isActive){
        this._rootNode.active = isActive;
    }

    getModuleNode(){
        return this._rootNode;
    }

    //确认框
    showConfirm(content, okCallback, canCelcallback,okBtnName, canelBtnName){
        this._gameState.showConfirm(content, okCallback, canCelcallback, okBtnName, canelBtnName)
    }

    //消息
    showMessage(content){
        this._gameState.showMessage(content)
    }

    /**
     * 处理模块内部Panel面板的行为事件
     * @param type
     * @param data
     */
    panelActionHandler(type, data){

    }

    /**
     * 处理模块外部，游戏的行为事件
     * @param event
     * @param data
     */
    gameActionHandler(event, data){

    }

    setLocalStorageByKey(key, info){
        cc.sys.localStorage.setItem(key, JSON.stringify(info));
    }

    getLocalStorageByKey(key){
        return JSON.parse(cc.sys.localStorage.getItem(key));
    }

    __invokeOnDispatch(payload){
        this.panelActionHandler(payload.type, payload.data);
    }

}

export default BasicModule