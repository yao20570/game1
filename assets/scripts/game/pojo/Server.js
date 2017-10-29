/**
 * Created by on 2017/9/26.
 */

class Server{
    _ip;
    _port;
    _area;
    _name;
    _state;
    _serverId;
    _openTime;
    _isPre;

    constructor(ip, port, area, name, state, serverId, openTime, isPre) {
        this._ip = ip;
        this._port = port;
        this._area = area;
        this._name = name;
        this._state = state;
        this._serverId = serverId;
        this._openTime = openTime;
        this._isPre = isPre;
    }

    get ip(){
        return this._ip;
    }

    set ip(value){
        this._ip = value;
    }


    get port() {
        return this._port;
    }

    set port(value) {
        this._port = value;
    }


    get area() {
        return this._area;
    }

    set area(value) {
        this._area = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get serverId() {
        return this._serverId;
    }

    set serverId(value) {
        this._serverId = value;
    }

    get openTime() {
        return this._openTime;
    }

    set openTime(value) {
        this._openTime = value;
    }

    get isPre() {
        return this._isPre;
    }

    set isPre(value) {
        this._isPre = value;
    }

    static valueOf(str){
        let infoAry = str.split(",");
        let serverId = parseInt(infoAry[5]);
        return new Server(
            infoAry[0],   //ip,
            parseInt(infoAry[1]),   //port,
            infoAry[2],   //area,
            infoAry[3],   // name,
            infoAry[4],  //state
            serverId,
            parseInt(infoAry[6]),  //openTime
            infoAry[7] == "pre"
        );
    }
}

export default Server;