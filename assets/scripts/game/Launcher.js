
import Game from "Game"
import logger from "Logger";
import ConfigDataManager from "ConfigDataManager";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        logger.error("111%s-%s", "3333", "33333");

        let game = new Game();
        game.startGame();
        this._game = game;
        cc.game.addPersistRootNode(this.node);

        //TODO：报错了，暂时屏蔽
        //let audioSource = this.getComponent(cc.AudioSource);
        //audioSource.play();

    },

    loading: function (completeCallback) {
        ConfigDataManager.init();
    },

    getGame(){
        return this._game;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._game){
            this._game.update(dt);
        }
    },
});
