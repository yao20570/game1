/**
 * Created by on 2017/10/17.
 */

import UIBaseMap from "UIBaseMap";
import logger from "Logger";
import MapDef from "MapDef";

const { ccclass, property } = cc._decorator;
@ccclass

class WorldMap extends UIBaseMap {
    constructor() {
        super();
        logger.info("执行初始化WorldMap");

        this._mapPanel = null; //MapPanel类
        this._currTileX = null; //
        this._currTileY = null; //
        this._reqTileX = null; //
        this._reqTileY = null; //

        this._scene = null;


    }

    initWorldMap(mapPanel) {
        //panel类直接赋值
        this._mapPanel = mapPanel;
        this._mapPanel.testWorldMapInit();

        let size = this.node.getContentSize() // 960--640
        this._halfWidth = size.width * 0.5
        this._halfHeight = size.height * 0.5

        this._mostTopY = size.height - MapDef.mapSize.height
        this._mostRightX = size.width - MapDef.mapSize.width


        this.initTilePos();//初始化自己的坐标数据


        ////////////////////////////
        this.onEnter();
    }


    initTilePos() {
        //this._reqTileX = 111;
        //this._reqTileY = 222;

        this._reqTileX = 111;
        this._reqTileY = 222;
    }

    onEnter() {
        if (this._scene == null) {

            let MapRes = MapDef.getMapRes();
            let mapType = MapRes.bgDefauleType;

            let floor = this._mapPanel.getComponentNode("WorldMapFloor");
            this.node.addChild(floor);

            this._scene = floor.getComponent("WorldMapFloor");

            this._scene.initFloorPanel(MapRes, mapType);

            this._scene.setMapSize(MapDef.mapSize);//设置尺寸

            this._scene.setAlphaFloorVisible(false);
        }

        this.setTileXY(this._reqTileX, this._reqTileY);//传入请求数据的坐标
    }

    //坐标设置入口
    setTileXY(tileX, tileY) {
        logger.info("目标坐标：" + tileX + "，" + tileY);
        let pos = MapDef.worldTileToScreen(tileX, tileY)
        let x = -pos.x + this._halfWidth;
        let y = -pos.y + this._halfHeight;
        this.setScenePosition(cc.p(x, y))
    }

    //将位置返回给Floor
    setScenePosition(pos) {
        logger.info("设置位置：")
        let y = Math.max(Math.min(pos.y, 0), this._mostTopY)
        let x = Math.max(Math.min(0, pos.x), this._mostRightX)
        let new_pos = cc.p(x, y)
        this._scene.node.setPosition(new_pos)
        this._scene.setMapPosition(new_pos)

    }

    //响应UIBaseMap的TOUCH_START
    //super了继承的onTouchBegan()函数
    onTouchBegan(event) {
        let began = super.onTouchBegan(event);
        if (began)
            this._scene.setAlphaFloorVisible(true);
        else
            this._scene.setAlphaFloorVisible(false);

    }



    //响应UIBaseMap调用的移动事件
    onSceneMove(delta) {
        let posX = this._scene.node.getPositionX()
        let posY = this._scene.node.getPositionY()

        let newPos = this.adjustPosition(posX, posY, delta.x, delta.y)

        this.setScenePosition(newPos);
        //设置箭头的逻辑
        //this.refreshCurrentTileCoor()
        //显示悬浮坐标
        //this.renderTopPos();
    }

    //响应UIBaseMap的TOUCH_MOVE
    //super了继承的onTouchEnd()函数
    //todo
    onTouchMoved(event) {
        super.onTouchMoved(event);
        //this._scene.setAlphaFloorVisible(true);
    }



    //响应UIBaseMap的TOUCH_END
    //super了继承的onTouchEnd()函数
    onTouchEnd(event) {
        super.onTouchEnd(event);
        this._scene.setAlphaFloorVisible(false);
    }




    //返回正确的newPos
    adjustPosition(x, y, dx, dy) {
        let newX = x + dx
        let newY = y + dy
        if (this.isInnerArea(newX, newY) == false) {
            newX = x
            newY = y



        }
        return cc.p(newX, newY);
    }

    //
    setScenePosition(pos) {
        let y = Math.max(Math.min(pos.y, 0), this._mostTopY)
        let x = Math.max(Math.min(0, pos.x), this._mostRightX)
        let new_pos = cc.p(x, y)
        this._scene.node.setPosition(new_pos)
        this._scene.setMapPosition(new_pos)
    }

    //
    isInnerArea(mapx, mapy) {
        let mid = cc.p(this._halfWidth - mapx, this._halfHeight - mapy)
        let x = mid.x
        let y = mid.y
        let p0 = MapDef.mapOrigin
        let pl = MapDef.mapLeftPoint
        let pr = MapDef.mapRightPoint
        let pt = MapDef.mapTopPoint

        let k1 = (y - p0.y) / (pl.y - p0.y) - (x - p0.x) / (pl.x - p0.x)
        let k2 = (y - p0.y) / (pr.y - p0.y) - (x - p0.x) / (pr.x - p0.x)

        let k3 = (y - pl.y) / (pt.y - pl.y) - (x - pl.x) / (pt.x - pl.x)
        let k4 = (y - pr.y) / (pt.y - pr.y) - (x - pr.x) / (pt.x - pr.x)

        if (k1 > 0 && k2 > 0 && k3 < 0 && k4 < 0)
            return true
        else
            return false
    }






}

export default WorldMap;
