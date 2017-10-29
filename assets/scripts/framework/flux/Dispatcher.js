/**
 * Created by on 2017/9/25.
 */

var _prefix = 'ID_';

export default class Dispatcher {
    _callbacks;
    _isDispatching;
    _isHandled;
    _isPending;
    _lastID;
    _pendingPayload;

    constructor() {
        this._callbacks = {};
        this._isDispatching = false;
        this._isHandled = {};
        this._isPending = {};
        this._lastID = 1;
    }

    register(callback) {
        var id = _prefix + this._lastID++;
        this._callbacks[id] = callback;
        return id;
    }

    unregister(id) {
        delete this._callbacks[id];
    }

    waitFor(ids) {
        for (var ii = 0; ii < ids.length; ii++) {
            var id = ids[ii];
            if (this._isPending[id]) {
                continue;
            }
            this._invokeCallback(id);
        }
    }

    dispatch(payload) {
        this._startDispatching(payload);
        try {
            for (var id in this._callbacks) {
                if (this._isPending[id]) {
                    continue;
                }
                this._invokeCallback(id);
            }
        } finally {
            this._stopDispatching();
        }
    }

    /**
     * Is this Dispatcher currently dispatching.
     */
    isDispatching() {
        return this._isDispatching;
    }

    /**
     * Call the callback stored with the given id. Also do some internal
     * bookkeeping.
     *
     * @internal
     */
    _invokeCallback(id) {
        this._isPending[id] = true;
        this._callbacks[id](this._pendingPayload);
        this._isHandled[id] = true;
    }

    /**
     * Set up bookkeeping needed when dispatching.
     *
     * @internal
     */
    _startDispatching(payload) {
        for (var id in this._callbacks) {
            this._isPending[id] = false;
            this._isHandled[id] = false;
        }
        this._pendingPayload = payload;
        this._isDispatching = true;
    }

    /**
     * Clear bookkeeping used for dispatching.
     *
     * @internal
     */
    _stopDispatching() {
        delete this._pendingPayload;
        this._isDispatching = false;
    }

}






