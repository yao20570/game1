
import GameLayerName from "GameLayerName";
import logger from "Logger";

class GameLayer{
    constructor(scene){
        this._canvas = cc.find("Canvas", scene);
        this._layers = {};
        this.initLayer();
    }

    initLayer(){
        for (var key in GameLayerName) {
            let layer = cc.find(key, this._canvas);
            // logger.info("!!!!!!!!!!!!!!", key, layer);
            this._layers[key] = layer;
        }
    }

    getLayer(name){
        return this._layers[name];
    }
}

export default GameLayer;