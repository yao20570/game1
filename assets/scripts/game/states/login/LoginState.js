
import GameBaseState from "GameBaseState";
import NetChannel from "NetChannel";
import ProtoManager from "ProtoManager";
import HttpRequestManager from "HttpRequestManager";
import ConfigDataManager from "ConfigDataManager";
import ConfigName from "ConfigName";
import logger from "Logger";
import GameLayerName from "GameLayerName";
import BasicPanel from "BasicPanel";
import LoginModule from "LoginModule";
import AppEvent from "AppEvent";
import GameModule from "GameModule";
import GameModuleMap from "GameModuleMap";


class LoginState extends GameBaseState {
    constructor() {
        super();

        //加载总数
        this._totalDownLoadCount = 0;
        //当前加载数
        this._curDownLoadCount = 0;
    }

    registerModules() {
        super.registerModules();

        let ary = [ 
                    GameModule.CreateRoleModule,//临时测试使用
                    GameModule.LoginModule, 
                    GameModule.LoaderModule
                  ]
        for (let moduleName of ary) {
            let module = GameModuleMap.getModule(moduleName);
            this.registerModuleClass(moduleName, module);
        }
    }

    afterCreateScene(scene) {
        super.afterCreateScene(scene);
    }

    onLoad() {
        super.onLoad();

        //因为资源加载异步，必须先将加载模块加载完再加载其它资源
        this.openModuleLoading();
    }

    gameActionHandler(event, data) {
        super.gameActionHandler(event, data)

        switch (event) {
            case AppEvent.LOADER_START:
                this.onLoadConfigFile();
                this.onLoadProtobufFile()
                break;
        }
    }

    //加载配置表
    onLoadConfigFile() {
        logger.info("=============>预加载配置表")
        this._totalDownLoadCount += ConfigDataManager.getTotalCount() ;
        ConfigDataManager.init((this.updateLoadingModuleProgress).bind(this));
    }

    //加载协议
    onLoadProtobufFile() {
        logger.info("=============>预加载协议")
        this._totalDownLoadCount += ProtoManager.getTotalCount();
        ProtoManager.init((this.updateLoadingModuleProgress).bind(this));
    }

    //打开加载模块
    openModuleLoading() {
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.LoaderModule });
    }


    //更新模块进度
    updateLoadingModuleProgress() {
        ++this._curDownLoadCount;

        let progress = Math.ceil(this._curDownLoadCount / this._totalDownLoadCount * 100);

        this.sendNotification(AppEvent.LOADER_UPDATE_PROGRESS, { loadProgress: progress });

        //等loading回调打开登录模块
        if (this._curDownLoadCount == this._totalDownLoadCount) {

            //打开LoginModule
            this.sendNotification(AppEvent.MODULE_OPEN_EVENT, { moduleName: GameModule.LoginModule });
        }
    }


}


export default LoginState;