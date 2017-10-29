import EventEmitter from "EventEmitter"

class MsgCenter{
    constructor(){
        this._eventEmitter = new EventEmitter();
    }

    addEventListener(mainevent, subevent, fun){
        let event = this.getEventKey(mainevent, subevent);
        this._eventEmitter.addListener(event, fun);
    }

    removeEventListener(mainevent, subevent, fun){
        let event = this.getEventKey(mainevent, subevent);
        this._eventEmitter.removeListener(event, fun);
    }

    sendNotification(mainevent, subevent, data){
        let event = this.getEventKey(mainevent, subevent);
        this._eventEmitter.emit(event, data);
    }

    getEventKey(mainevent, subevent){
        return mainevent + "$" + subevent;
    }
}

export default MsgCenter