/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";

class #panelName#Panel extends BasicPanel{

    //panel的初始化，还没能调用action
    initPanel(){
        //this.create1LvBg(titleName, width, height, closeCallback, helpCallback/*可选*/);
        //this.create2LvBg(titleName, helpCallback/*可选*/, closeCallback/*可选*/);
    }

    //panel的节点事件注册
    registerEvents(){
    }

    //panel的初始化后，可能调用action了
    afterinitPanel(){        
    }

    //打开面板
    onShowHandle(){
    }

    //关闭面板
    onHideHandle(){
    }

    ////////////////渲染相关////////////////////////////
    render(){

    }

}

#panelName#Panel.NAME = "#panelName#Panel";
export default #panelName#Panel;