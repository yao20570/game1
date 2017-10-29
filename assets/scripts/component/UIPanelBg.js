/**
 * Created by on 2017/10/16.
 */
import BasicComponent from "BasicComponent";
import logger from "Logger";
import UIUtils from "UIUtils";

const { ccclass, property } = cc._decorator;
@ccclass
class UIPanelBg extends BasicComponent {
    constructor() {
        super();
        this._closeCallback = null
    }

    initComponent() {
        this._defaultBg = this.getChildByName("defaultBg")
        this._frame_top = this.getChildByName("frame_top")
        this._titleBg = this.getChildByName("frame_top/titleBg")
        this._button = this.getChildByName("frame_top/button")
        this._titleNameLabel = this.getChildByName("frame_top/titleNameLabel")
        this._titleNameBg = this.getChildByName("frame_top/titleNameBg")

        this.node.addComponent("UIAdapter");
    }

    registerEvents() {
        this.addTouchEventListener(this._button, (e) => this.onCloseTouch(e));
        // this.addTouchEventListener(this._bgPanel, (e) => this.onCloseTouch(e));
    }

    setCloseBtn(callback) {
        this._closeCallback = callback
    }

    onCloseTouch(e) {
        logger.info("!!!!!!!!!!!!!!!!!点击模块关闭按钮!!!!!!!!!!!!!!!!!")
        //this._closeCallback() 
        if (typeof this._closeCallback == 'function') {
            logger.info(" this is a closeBtn function")
            this._closeCallback()
        }
        e.stopPropagation();
        if (this._closeCallback != null) {
            this._closeCallback.call(this);
        }

    }

    //外部调用  titileName 模块显示的名字  closeCallback 关闭事件 由外部传进来， node 外部子panel的node 先预留
    addPanel(titileName, closeCallback, node) {
        this.setTitle(titileName)
        this._closeCallback = closeCallback
    }

    setTitle(titileName) {
        this._titleNameLabel.getComponent(cc.Label).string = titileName
    }

    //设置背景图
    setImageBg(imgUrl) {        
        UIUtils.updateSprite(this._defaultBg, imgUrl)        
    }

    hideHelpBtn() {
        logger.info("nothing")
    }

    setHelpBtn(callback) {
        logger.info("nothing")
    }

}

export default UIPanelBg;