/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import StringUtils from "StringUtils"

class RoleInfoPanel extends BasicPanel{

    initPanel(){
        let mainPanel = this.node.getChildByName("mainPanel")
        //////////////////资源栏/////////////////
        let panelTop1 = mainPanel.getChildByName("panelTop1")
        for(let i = 1; i <= 5; i++){
            let name = "res" + i
            let node = panelTop1.getChildByName(name)
            node.label = node.getChildByName("label")
            node.barBg = node.getChildByName("barBg")//正式的bar
            this["_" + name] = node
        }

        ///////////////////头像栏//////////////////
        let panleTop2 = mainPanel.getChildByName("panleTop2")
        let nodePlayer = panleTop2.getChildByName("nodePlayer")
        this._labName = nodePlayer.getChildByName("labName")
        this._labLevel = nodePlayer.getChildByName("labLevel")

        let btnVip = panleTop2.getChildByName("btnVip")
        this._labVip = btnVip.getChildByName("labVip")

        this._labGold = panleTop2.getChildByName("btnGold").getChildByName("labGold")
        
    }

    registerEvents(){

    }

    ////////////////渲染相关////////////////////////////
    render(){
        this._labName.getComponent(cc.Label).string = this.state.get("name")
        this._labLevel.getComponent(cc.Label).string = "Lv." + this.state.get("level")
        this._labVip.getComponent(cc.Label).string = this.state.get("vipLevel")
        this._labGold.getComponent(cc.Label).string = this.state.get("goldNum")

        this.initMyResource()
    }


    initMyResource(){
        let resourceAttr = this.state.get("resourceAttr")
        for(let i = 0; i < 5; i++){
            let attr = resourceAttr[i]
            let nodeName = "_res" + (i+1)
            this[nodeName].label.getComponent(cc.Label).string = StringUtils.formatNumber(attr.val)
            this[nodeName].barBg.getComponent(cc.ProgressBar).progress = attr.val / attr.capacity
        }
    }

}

RoleInfoPanel.NAME = "RoleInfoPanel";
export default RoleInfoPanel;