/**
 * 基础面板
 * Created by on 2017/9/19.
 */


import BasicComponent from "BasicComponent";
import logger from "Logger";
import AllComponent from "AllComponent";

const { ccclass, property } = cc._decorator;
@ccclass
class BasicPanel extends BasicComponent {

    constructor() {
        super();
        this._view = null;

        this._uiPanelBg = null;
    }

    finalize() {

    }

    setView(view) {
        this._view = view;

        this.afterinitPanel();
    }

    getAction() {
        return this._view.getAction();
    }

    getInitialState() {
        return this.getStoreState();
    }

    getStoreState() {
        if (this._view == null) {
            return null;
        }
        return this._view.getState();
    }

    initComponent() {
        this.initPanel();
    }

    initPanel() {

    }

    registerEvents() {

    }

    afterinitPanel() {

    }

    onShowHandle() {

    }

    onHideHandle() {

    }

    onShow() {
        let storeState = this.getStoreState();
        let state = this.getState();
        if (storeState === state) {
            return;
        }
        this.setState(storeState); //用目前最新的数据刷新

        this.onShowHandle();
    }

    onHide() {
        this.onHideHandle();
    }

    showPanel(name) {
        this._view.showPanel(name);
    }

    hidePanel(name) {
        this._view.hidePanel(name);
    }

    setState(state) {
        if (!this.node.active) {
            logger.debug("!!!!!面板节点未激活，不更新!!!:%s!!!!!", this.constructor.name);
            return;
        }
        super.setState(state);
    }

    addChild(child) {
        this.node.addChild(child)
    }

    //确认框
    showConfirm(content, okCallback, canCelcallback, okBtnName, canelBtnName) {
        this._view.showConfirm(content, okCallback, canCelcallback, okBtnName, canelBtnName)
    }

    //消息
    showMessage(content) {
        this._view.showMessage(content)
    }

    //创建二级背景(弹窗) 调用的接口
    createLv2Bg(titleName, width, height, helpCallback, closeCallback) {
        if (this._uiPanelBg){
            logger.warn("=========>背景已创建，不能重复创建")
            return;
        }

        this._uiPanelBg = AllComponent.getInstantiate("UISecLvPanel");
        let component = this._uiPanelBg.getComponent("UISecLvPanel")

        this.node.addChild(this._uiPanelBg);
        this._uiPanelBg.zIndex = -1
        //通用控件 要在 addChild 方法之后 
        component.addPanel(titleName, width, height, this.node)
        component.setCloseBtn(closeCallback)
        if (typeof helpCallback == 'function') {
            component.setHelpBtn(helpCallback)
        }
        else {
            component.hideHelpBtn()
        }
                
        return component;
    }

    //创建一级背景(全屏) 调用的接口  先重载 方便识读  cao  函数还不给重载
    /**
     * @param {any} titleName  panel标题
     * @param {string} bgUrl  背景图片Url
     * @param {any} helpCallback  帮助按钮的回调函数
     * @param {any} closeCallback 自定义返回按钮的回调函数
     * @memberof BasicPanel
     */
    createLv1Bg(titleName, helpCallback, closeCallback) {
        if (this._uiPanelBg){
            logger.warn("=========>背景已创建，不能重复创建")
            return;
        }

        this._uiPanelBg = AllComponent.getInstantiate("UIPanelBg");
        let component = this._uiPanelBg.getComponent("UIPanelBg");

        this.node.addChild(this._uiPanelBg)
        this._uiPanelBg.zIndex = -1

        if (typeof closeCallback == 'function') {
            component.addPanel(titleName, closeCallback, this.node)               //关闭按钮 包含模块的hide方法
        } else {
            component.addPanel(titleName, () => this._view.hideModule(), this.node)               //关闭按钮 包含模块的hide方法
        }

        if (typeof helpCallback == 'function') {
            component.setHelpBtn(helpCallback)
        }
        else {
            component.hideHelpBtn()
        }

        return component;
    }

    getComponentNode(name) {
        return AllComponent.getInstantiate(name);
    }
}




export default BasicPanel;

