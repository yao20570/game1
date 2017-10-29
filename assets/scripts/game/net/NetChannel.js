/**
 * 网络管道，有可能会有多个网络管道的情况
 * Created by on 2017/9/19.
 */

import GameSocket from "GameSocket";
import ProtoManager from "ProtoManager";
import logger from "Logger";
import AppEvent from "AppEvent";
import Queue from "Queue";



class NetChannel {
    constructor(ip, port) {
        this._gameSocket = new GameSocket();
        this._serverIp = ip;
        this._serverPort = port;
        this._game = null;
        this._recvQueue = new Queue();//接受到的数据队列
        this._transceiverQueue = new Queue() //--协议传输队列

        this._curSendNetCount = 0 //--当前发送的协议数
        this._curRecvNetCount = 0 //--当前接受的协议数

    }

    finalize() {

    }

    //定时器
    onProtoSchedule() {
        for (let i = 0; i < 5; i++) {
            let recvData = this._recvQueue.pop()
            if (recvData) {
                this.dispatchRecvData(recvData)
                this._curRecvNetCount = self._curRecvNetCount + 1
            }
        }
    }

    /**
     * 方法说明 把已经解析的网络数据发出去
     * @method dispatchRecvData
     * @for NetChannel
     * @param this._recvQueue[i]
     * @return null
     */
    dispatchRecvData(recvData) {
        this._game.dispatchRecvData(recvData)
    }

    setGame(game) {
        this._game = game;
    }

    sendNotification(event, data) {
        this._game.getCurState().sendNotification(event, data);
    }

    launch() {
        this._gameSocket.setChannel(this);
        this._gameSocket.connect(this._serverIp, this._serverPort);
    }

    close() {
        this._gameSocket.close();
    }

    isConnected() {
        return this._gameSocket.isConnected();
    }

    onSuccessConnect() {
        this.sendNotification(AppEvent.NET_SUCCESS_CONNECT, null);
    }

    onFailConnect() {
        this.sendNotification(AppEvent.NET_FAIL_CONNECT, null);
    }

    //接受到网络消息
    recvNet(byteArray) {
        let self = this
        let responseSize = byteArray.readByte();
        let iscompress = byteArray.readByte();
        if (iscompress == 1) {  //压缩的，需要解压

        }

        for (var i = 0; i < responseSize; i++) {
            let protoSize = byteArray.readInt();
            let mId = byteArray.readInt();
            let cmdId = byteArray.readInt();
            logger.info("===== S2C ==> cmdId = " + cmdId);
            if (!(cmdId == 9999 || cmdId == 10000 || cmdId == 20000)) {
                //continue;
            }
            let offsetEnd = byteArray.offset + protoSize
            let bufferArray = byteArray.copy(byteArray.offset, offsetEnd);
            byteArray.offset = offsetEnd

            let bufferView = bufferArray.view || new Uint8Array();

            this.decode(mId, cmdId, bufferView, (data) => {
                logger.info("数据解析成功", data);
                self._recvQueue.push({ mId: mId, cmdId: cmdId, data: data })
            });
        }

        if (responseSize == 0) {  //只有一个数据包
            let mId = byteArray.readInt();
            let cmdId = byteArray.readInt();
            logger.info("===== S2C ==> cmdId = " + cmdId);
            let bufferArray = byteArray.copy(byteArray.offset, byteArray.buffer.byteLength);

            this.decode(mId, cmdId, bufferArray.view, (data) => {
                //logger.info("数据解析成功", data);
                self._recvQueue.push({ mId: mId, cmdId: cmdId, data: data })
            });
        }
    }

    // registerProto(){

    // }

    //发送网络数据
    sendNet(data) {
        let mId = data["mId"];
        let cmdId = data["cmdId"];
        let obj = data["obj"];

        this.encode(mId, cmdId, obj, (buffer) => {
            this.oneSendOneNet(mId, cmdId, buffer, this._curSendNetCount);
            ++this._curSendNetCount;
        });
    }

    //发送1条协议
    oneSendOneNet(mId, cmdId, buffer, reqTime) {
        var len = buffer.byteLength;
        var sendCount = 1;
        var byteArray = new dcodeIO.ByteBuffer();
        byteArray.writeInt(4 + 1 + (1 + 4 + 4) * sendCount + len);
        byteArray.writeInt(reqTime);
        byteArray.writeByte(sendCount);

        byteArray.writeInt(len);
        byteArray.writeByte(mId);
        byteArray.writeInt(cmdId);
        byteArray.flip();   //将缓冲区准备为数据传出状态,执行以上方法后,输出通道会从数据的开头而不是末尾开始.回绕保持缓冲区中的数据不变,只是准备写入而不是读取

        byteArray = dcodeIO.ByteBuffer.concat([byteArray, buffer]);
        byteArray.flip();
        logger.info("===== C2S ==> cmdId = " + cmdId);
        this._gameSocket.send(byteArray.buffer);
    }

    encode(mId, cmdId, obj, callback) {
        ProtoManager.getProtoType("M" + mId, "M" + cmdId + ".C2S", (type) => {
            var message = type.create(obj);
            var buffer = type.encode(message).finish();
            callback.call(this, buffer);
        });
    }

    //将二进制数据，decode成数据结构
    decode(mId, cmdId, buffer, callback) {
        if (140012 == cmdId) {
            let x = 1
        }
        ProtoManager.getProtoType("M" + mId, "M" + cmdId + ".S2C", (type) => {

            let message = type.decode(buffer);
            callback.call(this, message);
        });
    }
}

NetChannel.GAME = "Game";  //游戏网络管道
NetChannel.CHAT = "Chat";

export default NetChannel;