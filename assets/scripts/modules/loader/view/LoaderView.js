import BasicView from "BasicView";
import LoaderPanel from "LoaderPanel";

export default class LoaderView extends BasicView{
    //注册
    registerPanels(){
        this.registerPanel(LoaderPanel.NAME, LoaderPanel);
    }

    //显示
    showDefaultPanel(){
        this.showPanel(LoaderPanel.NAME);
    }

}