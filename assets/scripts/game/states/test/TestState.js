
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

class TestState extends GameBaseState{
    constructor(){
        super();
    }

    createScene(){
        super.createScene()
        logger.info("=====>TestState createScene")
        let sceneName = "scenes/state";
        cc.director.preloadScene(sceneName, () => {
            //
            cc.director.loadScene(sceneName, () => {
                //场景加载完毕
                let scene = cc.director.getScene();
                this.afterCreateScene(scene);
            });
        });
    }

    afterCreateScene(scene) {
        super.afterCreateScene(scene);
    }

    onLoad(){
        logger.info("~~~~~~TestState~~~initialize");
         this.testNetChannel();
        // this.testHttp();
        // this.testConfigDataManager();
        this.testModule();
    }

    testModule(){
        // let moduleNode = new cc.Node();
        // this.addToLayer(GameLayerName.uiLayer, moduleNode);
        // cc.loader.loadRes("panel/login/LoginPanel", (err, prefab) => {
        //     let newNode = cc.instantiate(prefab);
        //     newNode.setPosition(0, 0);
        //     moduleNode.addChild(newNode);
        //
        //     newNode.addComponent(BasicPanel);
        // });

        let loginModuleName = GameModule.LoginModule;
        logger.info(loginModuleName);
        let loginModule = GameModuleMap.getModule(loginModuleName);
        this.registerModuleClass(loginModuleName, loginModule);

        let loaderModuleName = GameModule.LoaderModule;
        let loaderModule = GameModuleMap.getModule(loaderModuleName);
        this.registerModuleClass(loaderModuleName, loaderModule);
        //
        this.sendNotification(AppEvent.MODULE_OPEN_EVENT, {moduleName : loginModuleName});


    }

    testNetChannel(){
        // let ip = "192.168.10.124";
        // let port = 8888;
        // let netChannel = new NetChannel(ip, port);
        // netChannel.launch();

        // let i = 0;
        // while (i < 10000){
        //     i++;
        //     setTimeout( () => {
        //         let data = {};
        //         data["mId"] = 1;
        //         data["cmdId"] = 8888;
        //         data["obj"] = {};
        //         netChannel.sendNet(data);
        //     }, 100 * i);
        // }

        ProtoManager.init((()=>{
            let xx = 1
            let yy = 2
            let chat = this
        }).bind(this))


        ProtoManager.getProtoType("Common", "AttrDifInfo", (type) => {
            logger.info(type);
        });
        
        ProtoManager.getProtoType("M1", "M8888.C2S", (type) => {
            logger.info(type);
        });


    }

    testHttp(){
        let params = {};
        params["game_id"] = 102;
        params["os"] = "android";
        params["plat_id"] = 0;
        params["channel_id"] = 0;
        params["client_version"] = "0.0"; // --这个版本号，是用来审核的，用包的版本号为依据
        params["client_version_real"] = "0.0";
        params["service"] = "Server.GetServerList";
        params["test"] = "2";
        params["mac"] =  "";
        HttpRequestManager.send("http://192.168.10.138:8001/gcol/", params, (info) => logger.info(info));
    }

    testConfigDataManager(){
        ConfigDataManager.init(() => {
            logger.info("配置数据，加载完毕");
            let config = ConfigDataManager.get(ConfigName.ChapterConfig, 101);
            logger.info("配置表数据：", config);
            let config2 = ConfigDataManager.getByUnique(ConfigName.ChapterConfig, "sort", 2);
            logger.info("配置表数据2：", config2);
            let configList = ConfigDataManager.getByList(ConfigName.ChapterConfig, "rankneed", 16);
            logger.info("配置表数据configList：", configList);
        });
        // ConfigDatamanager.loadConfig("ChapterConfig", (name, txt) => {
        //     logger.info(name, txt);
        // });
    }

}

export default TestState;