/**
 * Created by on 2017/10/13.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";

class LoaderPanel extends BasicPanel{
    initPanel(){

        this._presentTxt  = this.getChildByName("panelBottom/presentTxt");
        this._versionTxt  = this.getChildByName("panelBottom/versionTxt");
        this._percentTxt  = this.getChildByName("panelBottom/percentTxt");
        this._loadBar = this.getChildByName("panelBottom/loadBar");
        this._loadComponent = this._loadBar.getComponent(cc.ProgressBar);
       
    }

    onShow(){
        super.onShow()

        //loader面板完成，开始预加载
        this.getAction().loaderStart()
    }

    registerEvents(){

    }

    //渲染相关
    render(){
        let curProgress = this.state.get("curProgress");//获取state
        this._renderProgress(curProgress);
    }

    //渲染进度条，动作gctodo
    _renderProgress(curProgress){
        this.setLabel(this._percentTxt, curProgress + "%");
        this._loadComponent.progress = curProgress / 100;
    }


}

LoaderPanel.NAME = "LoaderPanel";
export default LoaderPanel;