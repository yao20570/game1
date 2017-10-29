/**
 * 基础数据代码
 * Created by on 2017/9/19.
 */

import TimeUtils from "TimeUtils";

class BasicProxy {
    constructor() {
        this._name = null;
        this._game = null;
        this._remainTimeMap = {}; //倒计时缓存
    }

    finalize() {

    }

    setProxyName(name) {
        this._name = name;
    }

    setGame(game) {
        this._game = game;
    }

    getProxy(proxyName){
        return this._game.getProxy(proxyName);
    }

    //重置数据，在切换账号的时候重置调用
    resetAttr() {

    }

    //数据初始化协议
    onTriggerNet20000Resp(data) {
        this.beforeInitSyncData();
        this.initSyncData(data);
        this.afterInitSyncData();
    }

    //每日重置协议
    onTriggerNet30103Resp(data) {
        this.resetCountSyncData(data);
    }


    //数据代理全部初始化前调用
    beforeInitSyncData() {

    }

    //数据代理初始化
    initSyncData(data) {
        this._remainTimeMap = {};  //重置剩余时间
    }

    //数据代理全部初始化完后调用
    afterInitSyncData() {

    }

    //每天数据重置调用
    resetCountSyncData(data) {

    }

    //--同步接收到的网络数据
    //--会具体映射到具体的操作方法
    //默认，每次接受到网络数据，都会进行改动BasicData数据
    //一个cmd会找到一个data
    syncNetRecv(cmd, data) {
        let triggerFunc = this["onTriggerNet" + cmd + "Resp"];
        if (triggerFunc != null) {
            triggerFunc.call(this, data);
        }
    }

    ///请求协议
    syncNetReq(mId, cmd, obj) {
        console.assert(mId && cmd, "忘记在AppEvent注册协议号了");
        let data = {};
        data.mId = mId;
        data.cmdId = cmd;
        data.obj = obj;
        this._game.sendGameChannelNet(data);
    }

    sendNotification(event, data) {
        let gameState = this._game.getCurState()
        gameState.sendNotification(event, data);
    }

    ////////////////定时器相关///／／／／／／／／／／／／
    //--key自定义的唯一key
    //--一个key只会对应一个唯一的定时对象
    //--加入该数据定义的相关倒计时
    //--倒计时为0时，回调completeCallback，同个时刻回调的是data的列表，业务逻辑需要处理具体的逻辑
    //--回到参数是data的列表，如果某个cmd的定时器过于多时，且定时时间一样，解决这种情况的多请求IO
    //--通过cmd来区分倒计时触发逻辑，一个cmd只能对应一个completeCallback
    //--每一个操作只会对应一个定时器逻辑
    //--当remainTime设置为0时，则将对应的定时器删除掉，只有同步到服务端发送过来的数据才会设置为0
    pushRemainTime(key, remainTime/*秒*/, cmd, data, completeCallback) {
        if (this._remainTimeMap[key] == null) {
            this._remainTimeMap[key] = {};
        }

        if (remainTime == 0) {
            delete this._remainTimeMap[key];
        } else {
            this._remainTimeMap[key] = {
                remainTime: remainTime,
                cmd: cmd,
                data: data,
                callback: completeCallback,
                insertTime: TimeUtils.getStampTime()
            }
        }
    }

    //获取key对应的剩余时间
    //UI层主动获取
    //该剩余时间是通过时间差算出来的
    getRemainTime(key) {
        if (this._remainTimeMap[key] == null) {
            return 0;
        }

        let obj = this._remainTimeMap[key];
        return this._getCurRemainTimeByObj(obj);
    }

    _getCurRemainTimeByObj(obj) {
        let remainTime = obj.remainTime;
        let insertTime = obj.insertTime;
        let curTime = TimeUtils.getStampTime();
        let curRemainTime = remainTime - (curTime - insertTime);
        if (curRemainTime < 0) {
            curRemainTime = 0;
        }

        return curRemainTime;
    }

    //每秒定时检测，检测对应的定时器是否倒计时结束了
    //如果倒计时结束了，则执行同步操作
    //同时标志改cmd状态为请求状态中，如果请求状态超过3秒，则重新请求操作
    //设定一个最大尝试请求次数，如果超过则直接断线
    update(dt) {
        let needSyncList = {};
        let curTime = TimeUtils.getStampTime();
        let removeKey = [];
        for (let key in this._remainTimeMap) {
            let obj = this._remainTimeMap[key];
            let curRemainTime = this._getCurRemainTimeByObj(obj);
            if (curRemainTime <= 0 && obj.syncTime == null) {
                obj.syncCount = 1;
                if (obj.cmd != null) { //--一些操作不需要回调同步，客户端直接删除对应的定时器
                    if (needSyncList[obj.cmd] == null) {
                        needSyncList[obj.cmd] = [];
                    }
                    needSyncList[obj.cmd].push(obj);
                } else {
                    removeKey.push(key);
                }
            }

            if (obj.syncTime != null) {
                if (curTime - obj.syncTime >= 3) {  //3秒了，还没有同步数据过来，再尝试请求一遍
                    obj.syncCount = obj.syncCount + 1;
                    if (needSyncList[obj.cmd] == null) {
                        needSyncList[obj.cmd] = [];
                    }
                    needSyncList[obj.cmd].push(obj);
                }
            }

            if (obj.syncCount != null && obj.syncCount >= 10) {  //--已经请求过多同步了，直接断线
                //TODO 断线处理
            }
        }

        for (let i in removeKey) {
            let obj = this._remainTimeMap[removeKey[i]];
            if(obj.callback){
                obj.callback.call(this, obj.data)
            }
            delete this._remainTimeMap[removeKey[i]];
        }

        if (this._game.isGameNetConnected()) {
            for (let cmd in needSyncList) {
                let list = needSyncList[cmd];
                let sendDataList = [];
                let callback = null;
                for (let i in list) {
                    let obj = list[i];
                    obj.syncTime = TimeUtils.getStampTime();
                    callback = obj.callback;
                    sendDataList.push(obj.data);
                }

                callback.call(this, sendDataList);
            }
        }
    }



}

export default BasicProxy;
