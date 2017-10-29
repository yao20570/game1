/**
 * 单例
 * Created by on 2017/9/19.
 */

import ProtoName from "ProtoName"
import logger from "Logger"

class ProtoManager {
    constructor() {
        this._packageTypeMap = {};
    }

    //初始化，加载所有的proto package
    init(callback) {
        this._loadAllPackage(callback)
    }

    //预加载所有的proto package
    _loadAllPackage(callback) {
        let totolLoadCount = 0;
        let curLoadCount = 0;
        for (let k in ProtoName) {
            ++totolLoadCount
            this._loadPackage(ProtoName[k], ((root) => {
                ++curLoadCount
                // if (totolLoadCount == curLoadCount && callback) {
                    callback()
                // }
            }).bind(this));
        }
    }

    getTotalCount(){
        let i = 0;
        for (let k in ProtoName) {
            i++;
        }
        return i;
    }

    //加载单独一个包
    // callback(root) -- root是协议包
    _loadPackage(packageName, callback) {

        let url = "proto/" + packageName + "";
        protobuf.load(url, (err, root) => {
            if (err) {
                logger.info("ProtoManager->_loadPackage package:%s, err:%s", packageName, err)
            } else {
                //保存包
                this._packageTypeMap[packageName] = root;

                //完成回调
                if (typeof callback == "function") {
                    callback(root);
                }
            }
        });
    }

    getProtoType(packageName, typeName, callback) {
        //logger.info("getProtoType = > typeName :", typeName)
        this._loadPackageType(packageName, (packageType) => {
            let type = packageType.lookupType(packageName + "." + typeName); //TODO 这里可以将类型缓存起来，优化
            callback.call(this, type);
        });
    }

    _loadPackageType(packageName, callback) {
        let packageType = this._getPackageType(packageName);
        if (packageType != null) {
            callback.call(this, packageType);
            return;
        }

        let realUrl = cc.url.raw("resources/proto/" + packageName + ".proto");
        logger.warn("===========>%s需要预加载", realUrl);
        protobuf.load(realUrl, (err, root) => {
            this._packageTypeMap[packageName] = root;
            callback.call(this, root);
        });
    }

    _getPackageType(packageName) {
        if (!this._packageTypeMap.hasOwnProperty(packageName)) {
            return null;
        }
        return this._packageTypeMap[packageName];
    }
}

let manager = new ProtoManager();

export default manager;