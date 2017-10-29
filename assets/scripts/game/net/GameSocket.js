/**
 * Created by on 2017/9/19.
 */
import logger from "Logger";

class GameSocket {
    constructor() {
        this._socket = null;
        this._channel = null;

        this._connected = false;      //是否已经连接上了
        this._isReconnect = false;    //是否重连
        this._isAutoClose = true;
    }

    finalize() {

    }

    setChannel(channel) {
        this._channel = channel;
    }

    isConnected(){
        return this._connected
    }

    //客户端强制断开链接
    close() {
        this._socket.close();
    }

    //由于心跳等原因，自动关闭链接
    autoClose() {

    }

    connect(ip, port) {
        var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
        var link = "ws://" + ip + ":" + port;
        // var link = "ws://echo.websocket.org";
        let ws = new WebSocket(link);
        ws.binaryType = "arraybuffer";

        ws.onopen = (evt) => this.onOpen(evt);
        ws.onmessage = (evt) => this.onMessage(evt);
        ws.onerror = (evt) => this.onError(evt);
        ws.onclose = (evt) => this.onClose(evt);

        this._socket = ws;
    }

    //网络链接上
    onOpen(evt) {
        this._connected = true;
        this._isAutoClose = true;
        //TODO 重连补充
        logger.info("!!!!!!!网络连接上!!!!!!!!!!!!");
        this._channel.onSuccessConnect();
    }

    //接受到网络数据
    onMessage(evt) {      
        //logger.info("~~~~~onMessage~~~~ evt.data :" , evt.data);
        var binary = new Uint8Array(evt.data);
        //logger.info("~~~~~onMessage~~~~:" , binary.buffer);
        var byteArray = dcodeIO.ByteBuffer.concat([binary.buffer]);
        byteArray.flip();
        this._channel.recvNet(byteArray);
    }

    //网络错误
    onError(evt) {
        logger.error("Send Binary WS was error.");
        this._channel.onFailConnect();
    }

    //网络关闭
    onClose(evt) {
        logger.warn("Send Binary WS was close.");
        this._channel.onFailConnect();
    }

    send(buffer) {
        if (this._socket.readyState == WebSocket.OPEN){
            this._socket.send(buffer);
        }else {
            logger.warn("!!!!网络关闭中，无法发送数据!!!!!")
        }
    }
}

export default GameSocket;




















