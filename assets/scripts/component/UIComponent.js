/**
 * 常用控件集合，
 * 通过引用Prefab
 * 来进行加载，方便逻辑
 * Created by on 2017/9/26.
 */
import BasicComponent from "BasicComponent";
import AllComponent from "AllComponent";

const {ccclass, property} = cc._decorator;
@ccclass
class UIComponent extends BasicComponent{

    @property(cc.Prefab)
    uiSecLvPanel = null;

    @property(cc.Prefab)
    UIComponents = [];

    //把所有的自定义控件预览引用，先都保存起来，方便业务逻辑
    initComponent(){
        super.initComponent();
        for( let key in this.UIComponents){
            var prefab = this.UIComponents[key];         
            AllComponent.addComponentPrefab(this.UIComponents[key].name, this.UIComponents[key]);
        }
        
    }

}

export default UIComponent;