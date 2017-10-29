import BasicComponent from "BasicComponent";
import logger from "Logger";

const {ccclass, property} = cc._decorator;
@ccclass
class UITabControl extends BasicComponent{
    constructor()
    {
        super();
        this._itemPanel ={}   
        this._currentPanel = null;
        this._itemArray = []
        this._parentPanel= null
    }

    initComponent()
    {
        this._UITab = this.getChildByName("UITab")
        this._view = this.getChildByName("view")
        this.node.addComponent("UIAdapter");
    }

    registerEvents(){

    }

    setParent(panel)
    {
        this._parentPanel = panel
    }

    //添加页签 
    addTabPanel(panelName,titleName)
    {      
        //logger.info("页签添加了一个 标签 ",panelName)
        let UITab = cc.instantiate(this._UITab)
        UITab.panelName =panelName
        UITab.titleName =titleName
        let Label = UITab.getChildByName("Label")
        Label.getComponent(cc.Label).string = titleName

        this._itemArray.push(UITab)
        this._view.addChild(UITab)
        UITab.active = true

        this.addTouchEventListener(UITab,(sender)=>this.onTabTouch(sender))

        //如果 页签的数组大小 > 0  就让数组的一号元素 列为选中状态
        if(this._itemArray.length >0)
        {   
            this._currentPanel = this._itemArray[0].panelName
            this.buttonControl(this._currentPanel)
        }
    }
    

    onTabTouch(sender)
    {   
        //logger.info("当前的 panelName ",this._currentPanel)
        let target = sender.target;
        let panelName = target.panelName
        if(this._currentPanel == panelName)
        {
            return;
        }
        else
        {
            this._currentPanel = panelName
            //logger.info("替换了 一个panelName",this._currentPanel)
            this.buttonControl(this._currentPanel)
        }  
    }

    //设置页签小红点 panel表示第几个页签 从1开始  num表示数量 =0 不显示 ，bool ==false 也不显示
    setItemCount(panel,num,bool = true)
    {
        if (bool ==  false)
        {
            return;
        }
        else
        {
            if(panel < this._itemArray.length && panel > 0  && this._itemArray.length > 0)
            {
                let UITab = this._itemArray[panel-1]
                let redPoint = UITab.getChildByName("redPoint")
                let pointNum = redPoint.getChildByName("num")
                
                if (num > 0 )
                {           
                    redPoint.active =true
                    pointNum.getComponent(cc.Label).string = num
                    //this.setLabel(pointNum,num)
                }
                else
                {
                    redPoint.active = false
                }

            }
        }
    }

    //每次点击或者别的处理 都要 对页签的button 重新设置一遍 
    buttonControl(panelName)
    {  
        for(let i=0;i<this._itemArray.length;i++ )
        {
            let UITab = this._itemArray[i];
            let buttonComponent = UITab.getComponent(cc.Button)
            if(UITab.panelName == panelName)
            {
                buttonComponent.interactable =false
                this._parentPanel.showPanel(panelName)
            }
            else
            {
                buttonComponent.interactable =true
                this._parentPanel.hidePanel(UITab.panelName)
                
            }
        }


        // for(let i=0;i<this._itemArray.length;i++)
        // {
        //     let UITab = this._itemArray[i];
        //     let buttonComponent = UITab.getComponent(cc.Button)
        //     logger.info(UITab.panelName)
        //     logger.info(buttonComponent.interactable )
        // }



    }

}
