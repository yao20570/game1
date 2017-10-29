/**
 * 派发出行为出来
 * Created by on 2017/9/25.
 */
export default class BasicAction{
    constructor(dispatch){
        this._dispatch = dispatch;
        this._module = null;
    }

    dispatch(type, data){
        this._dispatch.dispatch({type : type, data : data});
    }

    setModule(module){
        this._module = module;
    }

    getProxy(proxyName) {
        return this._module.getProxy(proxyName);
    }

    setLocalStorageByKey(key, info){
        this._module.setLocalStorageByKey(key, info);
    }

    getLocalStorageByKey(key){
        return this._module.getLocalStorageByKey(key);
    }
}