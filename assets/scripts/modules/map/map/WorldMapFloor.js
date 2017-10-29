/**
 * Created by on 2017/10/18.
 */

import logger from "Logger";
import BasicComponent from "BasicComponent";
import GlobalConfig from "GlobalConfig";
import MapDef from "MapDef";


const {ccclass, property} = cc._decorator;
@ccclass

class WorldMapFloor extends BasicComponent {
    constructor(){
        super();

    }

    initComponent()
    {
        this._floor = this.getChildByName("floor");

    }

    registerEvents(){


    }

    initFloorPanel(resConfig, mapType) {
        logger.info("地图类型为： " + mapType);
        logger.info("Floor层级： " + WorldMapFloor.Layer_Type_Floor);

        this.initFloor(resConfig, mapType);

        let worldMapScale = GlobalConfig.worldMapScale;
        this._mapScale = worldMapScale;
        this.setMapScale(this._mapScale);
    }

    initFloor(resConfig, mapType){
        let bgUrl = resConfig.bg;
        let bgAlpha = resConfig.bgAlpha;

        this._bgImg1 = this.addOneNewSprite(bgUrl, this._floor);
        this._bgImg2 = this.addOneNewSprite(bgUrl, this._floor);
        this._bgImg3 = this.addOneNewSprite(bgUrl, this._floor);
        this._bgImg4 = this.addOneNewSprite(bgUrl, this._floor);
        this._bgImg5 = this.addOneNewSprite(bgUrl, this._floor);
        this._bgImg6 = this.addOneNewSprite(bgUrl, this._floor);
        this._bgImg31 =this.addOneNewSprite(bgUrl, this._floor);
        this._bgImg61 =this.addOneNewSprite(bgUrl, this._floor);


        this._bgAlphaImg1  = this.addOneNewSprite(bgAlpha, this._floor);
        this._bgAlphaImg2  = this.addOneNewSprite(bgAlpha, this._floor);
        this._bgAlphaImg3  = this.addOneNewSprite(bgAlpha, this._floor);
        this._bgAlphaImg4  = this.addOneNewSprite(bgAlpha, this._floor);
        this._bgAlphaImg5  = this.addOneNewSprite(bgAlpha, this._floor);
        this._bgAlphaImg6  = this.addOneNewSprite(bgAlpha, this._floor);
        this._bgAlphaImg31 = this.addOneNewSprite(bgAlpha, this._floor);
        this._bgAlphaImg61 = this.addOneNewSprite(bgAlpha, this._floor);


    }


    //固定缩放地图
    setMapScale(scale){
        this._bgImg1.setScale(scale, scale);
        this._bgImg2.setScale(scale, scale);
        this._bgImg3.setScale(scale, scale);
        this._bgImg4.setScale(scale, scale);
        this._bgImg5.setScale(scale, scale);
        this._bgImg6.setScale(scale, scale);
        this._bgImg31.setScale(scale, scale);
        this._bgImg61.setScale(scale, scale);


        this._bgAlphaImg1.setScale(scale, scale);
        this._bgAlphaImg2.setScale(scale, scale);
        this._bgAlphaImg3.setScale(scale, scale);
        this._bgAlphaImg4.setScale(scale, scale);
        this._bgAlphaImg5.setScale(scale, scale);
        this._bgAlphaImg6.setScale(scale, scale);
        this._bgAlphaImg31.setScale(scale, scale);
        this._bgAlphaImg61.setScale(scale, scale);

    }

    //显示OR隐藏半透明格子地皮
    setAlphaFloorVisible(isShow){

        this._bgAlphaImg1.active = isShow;
        this._bgAlphaImg2.active = isShow;
        this._bgAlphaImg3.active = isShow;
        this._bgAlphaImg4.active = isShow;
        this._bgAlphaImg5.active = isShow;
        this._bgAlphaImg6.active = isShow;
        this._bgAlphaImg31.active = isShow;
        this._bgAlphaImg61.active = isShow;

    }



    //更新背景todo
    updateMapBg(resConfig, mapType){


    }
    //设置尺寸
    setMapSize(size){
        this.node.setContentSize(size);
    }

    //获取node
    getLayer(layerType){
        if (layerType == WorldMapFloor.Layer_Type_Floor)
            return this._floor;
        else if (WorldMapFloor.Layer_Type_Safe_Range)
            return null;
    }

    //设置位置
    setMapPosition(pos){
        logger.info("位置：X = " + pos.x + " y = "+ pos.y)

        let mapFloorWidth = MapDef.floorWidth * this._mapScale;
        let mapFloorHeight = MapDef.floorHeight * this._mapScale;
        let basePos = cc.p(-pos.x, -pos.y);

        let col = Math.floor(basePos.x / mapFloorWidth);
        let row = Math.floor(basePos.y / mapFloorHeight);

        let colx = col * mapFloorWidth - MapDef.changeX * GlobalConfig.worldMapScale ;
        let rowy = row * mapFloorHeight - MapDef.changeY * GlobalConfig.worldMapScale ;
        let dx = basePos.x - colx;
        let dy = basePos.y - rowy;

        this._bgImg1.setPosition(cc.p(colx, rowy));
        this._bgImg2.setPosition(cc.p(colx, rowy + mapFloorHeight));
        this._bgImg3.setPosition(cc.p(colx, rowy + mapFloorHeight * 2));
        this._bgImg31.setPosition(cc.p(colx, rowy + mapFloorHeight * 3));

        this._bgImg4.setPosition(cc.p(colx + mapFloorWidth, rowy));
        this._bgImg5.setPosition(cc.p(colx + mapFloorWidth, rowy + mapFloorHeight));
        this._bgImg6.setPosition(cc.p(colx + mapFloorWidth, rowy + mapFloorHeight * 2));
        this._bgImg61.setPosition(cc.p(colx + mapFloorWidth, rowy + mapFloorHeight * 3));

        //格子地图位置
        this._bgAlphaImg1.setPosition(cc.p(colx, rowy));
        this._bgAlphaImg2.setPosition(cc.p(colx, rowy + mapFloorHeight));
        this._bgAlphaImg3.setPosition(cc.p(colx, rowy + mapFloorHeight * 2));
        this._bgAlphaImg31.setPosition(cc.p(colx, rowy + mapFloorHeight * 3));
        this._bgAlphaImg4.setPosition(cc.p(colx + mapFloorWidth, rowy));
        this._bgAlphaImg5.setPosition(cc.p(colx + mapFloorWidth, rowy + mapFloorHeight));
        this._bgAlphaImg6.setPosition(cc.p(colx + mapFloorWidth, rowy + mapFloorHeight * 2));
        this._bgAlphaImg61.setPosition(cc.p(colx + mapFloorWidth, rowy + mapFloorHeight * 3));

    }


    ///////////////////////////////////////////////////////
    //创建精灵并加载
    addOneNewSprite(url, floorNode){
        var node = new cc.Node();
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw(url));

        node.setAnchorPoint(0.5, 1);
        floorNode.addChild(node);
        return node;
    }

}

WorldMapFloor.Layer_Type_Floor      = 1;  //地图背景层
WorldMapFloor.Layer_Type_Safe_Range = 2;  //地图安全范围层
WorldMapFloor.Layer_Type_Nodes      = 3;  //地图节点层
WorldMapFloor.Layer_Type_March_Line = 4;  //行军路线层
WorldMapFloor.Layer_Type_March_Actor= 5;  //行军军队层
WorldMapFloor.Layer_Type_Nodes_Name = 6;  //地图节点名

export default WorldMapFloor;
