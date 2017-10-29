/**
 * Created by on 2017/9/26.
 */
import BasicComponent from "BasicComponent";
import logger from "Logger";

const {ccclass, property} = cc._decorator;
@ccclass
class UIAdapter extends BasicComponent{

    constructor(){
        super();
    }

    initComponent(){
        let winSize = cc.director.getWinSize()
        this.node.height = winSize.height
    }     
}

export default UIAdapter;