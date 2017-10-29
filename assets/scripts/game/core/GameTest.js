/**
 * Created by on 2017/10/18.
 */

import HttpRequestManager from  "HttpRequestManager";

class GameTest {

    setGame(game){
        this._game = game
    }

    debug(){
        // let debugUrl = "http://localhost:7456/preview-scripts/assets/scripts/framework/structure/Queue.js";
        // HttpRequestManager.send(debugUrl, {}, (info) => this.getInfo(info));
    }

    getInfo(info){
        console.info(info);
    }
}

export default new GameTest()