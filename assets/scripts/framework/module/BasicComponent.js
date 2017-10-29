/**
 * 基础控件
 * 参考react
 * View： 视图层
 * Created by on 2017/9/20.
 */

import logger from "Logger";
import UIUtils from "UIUtils";

const {ccclass, property} = cc._decorator;
@ccclass
class BasicComponent extends cc.Component{

    // @property(cc.Label)
    // label;

    constructor(){
        super();
        this.props = this.getDefaultProps();  //静态数据
        this.state = null; //动态数据，修改时，会直接触发render
        this._init = false;
    }

    finalize(){

    }

    getInitialState(){
        return null;
    }

    getState(){
        return this.state;
    }

    onLoad() {
        if(this._init){
            return;
        }
        this._init = true;
        this.initComponent();
        this.registerEvents();

        this.state = this.getInitialState();
        this.setState(this.state);
    }

    start(){
        //logger.info("==========>component start")
    }

    setState(state){
        this.state = state;
        if(!this._init){
            logger.debug("控件还未初始化，不进行渲染:%s", this.constructor.name);
            return;
        }
        if(this.state == null){
            logger.debug("状态数据为空，不进行渲染:%s", this.constructor.name);
            return;
        }
        if(this.node.active == false){
            logger.debug("控件还被激活，不进行渲染:%s", this.constructor.name);
            return;
        }
        logger.debug("开始执行渲染:%s", this.constructor.name);
        this.render(); //TODO 这里还需要进行优化，当state数据都一样时，则不进行更新
    }

    //可以用来设置组件属性的默认值
    getDefaultProps(){
        return {};
    }

    initComponent(){  //初始化组件

    }

    registerEvents(){  //注册事件

    }

    /////////////////////工具类////////////////////////////
    addTouchEventListener(widget, endedcallback){
        // widget.on(cc.Node.EventType.MOUSE_UP, endedcallback);//此方法会导致,按钮在scrollview上面拖动的时候,也会触发endedcallback
        widget.on(cc.Node.EventType.TOUCH_END, endedcallback);

        //TODO:到时调用UIUtils的
    }

    addTouchUp(widget, upCallback){
        widget.on(cc.Node.EventType.TOUCH_END, upCallback);
    }

    getChildByName(name){
        return cc.find(name, this.node);
    }

    setLabel(node, str){
        UIUtils.setString(node, str)
    }

    setPercent(node, num){
        UIUtils.setPercent(node, num)
    }

    setSprite(node, url){
        UIUtils.setSprite(node, url)
    }


    //////////////////////////////////////////////

    render(){

    }
}

export default BasicComponent;
