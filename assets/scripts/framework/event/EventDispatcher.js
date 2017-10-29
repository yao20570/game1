import EventEmitter from "EventEmitter"

class EventDispatcher{
    constructor(){
        this._eventEmitter = new EventEmitter();
    }

    addEventListener(event, fun){
        this._eventEmitter.addListener(event, fun);
    }

    removeEventListener(event, fun){
        this._eventEmitter.removeListener(event, fun);
    }

    dispatchEvent(event, data){
        this._eventEmitter.emit(event, data);
    }

}

export default EventDispatcher