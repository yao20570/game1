
import GlobalConfig from "GlobalConfig";

let MapDef = {};




MapDef.floorWidth = 1200;//地图图片的长尺寸
MapDef.floorHeight = 600;//地图图片的宽尺寸


MapDef.tileWidth = MapDef.floorWidth / 4 * GlobalConfig.worldMapScale; //从MapDef.floorWidth转
MapDef.tileHeight = MapDef.floorHeight / 4 * GlobalConfig.worldMapScale;

MapDef.tileSize = cc.size(MapDef.tileWidth, MapDef.tileHeight); //小格的尺寸

MapDef.tileViewMax = 3;
MapDef.tileMaxSize = 602;//分成的格子数，格子总数 = 602*602

//地图节点的总尺寸
MapDef.mapSize = cc.size(MapDef.tileWidth * MapDef.tileMaxSize, MapDef.tileHeight * MapDef.tileMaxSize); // {height=81270 width=162540 }

//上下左右pos
MapDef.mapTopPoint = cc.p(MapDef.mapSize.width / 2, MapDef.mapSize.height - MapDef.tileHeight);
MapDef.mapOrigin = cc.p(MapDef.mapSize.width / 2, MapDef.tileHeight);
MapDef.mapLeftPoint = cc.p(MapDef.tileWidth, MapDef.mapSize.height / 2);
MapDef.mapRightPoint = cc.p(MapDef.mapSize.width - MapDef.tileWidth, MapDef.mapSize.height / 2);



let MapRes = {
    bgDefauleType: 1,
    bg: "resources/bg/map/map_bg1.webp",
    bgAlpha: "resources/bg/map/map-alpha.webp"
};


MapDef.getMapRes = () => {
    return MapRes
};

MapDef.changeX = 150;             ////地图偏移坐标X (x不能小于0)
MapDef.changeY = 160;             //地图偏移坐标Y
MapDef.changeTileX = 0;        //格子偏移坐标X
MapDef.changeTileY = 0;     //格子偏移坐标Y

MapDef.worldTileToScreenXY = (tileX, tileY) => {
    let x = MapDef.mapOrigin.x + (tileX - tileY) * MapDef.tileWidth / 2 + MapDef.changeTileX * GlobalConfig.worldMapScale
    let y = MapDef.mapOrigin.y + (tileX + tileY + 1) * MapDef.tileHeight / 2 + MapDef.changeTileY * GlobalConfig.worldMapScale
    return cc.p(x, y);
}

MapDef.worldTileToScreen = (tileX, tileY) => {
    let screenPos = MapDef.worldTileToScreenXY(tileX, tileY)
    return screenPos
}


export default MapDef;