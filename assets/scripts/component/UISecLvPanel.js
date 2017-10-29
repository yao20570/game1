/**
 * Created by on 2017/9/26.
 */
import BasicComponent from "BasicComponent";
import logger from "Logger";

const {ccclass, property} = cc._decorator;
@ccclass
class UISecLvPanel extends BasicComponent{

    @property
    width = 0;
    @property
    height = 0;

    constructor(){
        super();
        this._closeCallback = null;
        this._helpBtnCallback=null;
    }

    initComponent(){
        this.state = {width : this.width, height : this.height};
        this._closeBtn = this.getChildByName("frameTop/closeBtn");
        this._helpBtn = this.getChildByName("frameTop/helpBtn");
        this._nameTxt = this.getChildByName("frameTop/nameTxt")
        this._frameTop = this.getChildByName("frameTop");
        this._frameMiddle = this.getChildByName("frameMiddle");
        this._frameBottom = this.getChildByName("frameBottom");
        this._bgPanel = this.getChildByName("bgPanel");
    } 

    registerEvents(){
        this.addTouchEventListener(this._closeBtn, (e) => this.onCloseTouch(e));
        // this.addTouchEventListener(this._bgPanel, (e) => this.onCloseTouch(e));
        this.addTouchEventListener(this._helpBtn,(e)=>this.onHelpBtn(e))
    }

    onHelpBtn(e)
    {
        logger.info("!!!!!!!!!!!!!onHelpBtn!!!!!!!!!!!!!!!!!")
        e.stopPropagation()
        if(this._helpBtnCallback != null)
        {
            if (typeof this._helpBtnCallback == 'function')
            {
                this._helpBtnCallback()
            }
        }
    }

    onCloseTouch(e){
        logger.info("!!!!!!!onCloseTouch!!!!!!!");


        e.stopPropagation();
        if(this._closeCallback != null){
            // logger.info(" closeCallback  != null ")
            // if( typeof this._closeCallback == 'function')
            // {
            //  logger.info(" do callback")
            //  this._closeCallback()
            // }
            this._closeCallback.call(this);
        }
    }

    render(){
        let width = this.state.width;
        let height = this.state.height;
        //logger.info("%d----%d", width, height);
    }

    addPanel(titleName, width,height,panel,)
    {
        logger.info("%d----%d", width, height);
        this._frameTop.y = height / 2 + this._frameTop.height / 2
        this._frameMiddle.height = height
        this._frameMiddle.y = this._frameTop.y-this._frameMiddle.height/2-this._frameTop.height/2
        this._frameBottom.y =  this._frameMiddle.y-this._frameMiddle.height/2
        this.setTitle(titleName)
    }

    setCloseBtn(callback){
        this._closeCallback = callback
    }

    setHelpBtn(callback) 
    {
        this._helpBtnCallback=callback
    }

    //如果没有给 helpBtn 添加回调函数  就隐藏这个帮助按钮
    hideHelpBtn()
    {
        this._helpBtn.active = false
    }

    setTitle(titleName)
    {
        this._nameTxt.getComponent(cc.Label).string = titleName 
    }
}

export default UISecLvPanel;