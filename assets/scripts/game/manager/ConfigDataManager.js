/**
 * Created by on 2017/9/20.
 */

import ConfigName from "ConfigName";
import logger from "Logger";



class ConfigDataManager {

    constructor() {
        this._configDataMap = {};
        this._keyOfDataResultMap = {};
        this._keyOfListResultMap = {};
    }

    init(callback) {
        this._loadAllConfig(callback);
    }

    //获取配置表
    getTable(name) {
        return this._getConfigData(name);
    }

    //通过唯一ID获取
    get(name, id) {
        let configData = this._getConfigData(name);
        return configData[id];
    }

    //获取匹配的数据
    //name : 配置表名称
    //matchData : 匹配数据格式{name:"小明", age:"18"}
    getMatchData(name, matchData) {
        let key = this._matchData2Key(matchData)
        let cache = this._keyOfDataResultMap[key]
        if (cache || this._keyOfDataResultMap.hasOwnProperty(key)) {
            return cache;
        }

        let table = this._getConfigData(name);
        for (let key in table) {
            let data = table[key]
            if (this._isDataMatch(data, matchData)) {
                this._keyOfDataResultMap[key] = data
                return data
            }
        }
        this._keyOfDataResultMap[key] = null
        return null
    }

    //获取匹配的列表
    //name : 配置表名称
    //mathcData : 匹配数据格式{name:"小明", age:"18"}
    getMatchList(name, matchData) {
        let key = this._matchData2Key(mathcData)
        let cache = this._keyOfListResultMap[key]
        if (cache || this._keyOfListResultMap.hasOwnProperty(key)) {
            return cache;
        }

        let ary = []
        let table = this._getConfigData(name);
        for (let key in table) {
            let data = table[key]
            if (this._isDataMatch(data, matchData)) {
                ary.push(data)
            }
        }
        this._keyOfDataResultMap[key] = ary
        return ary
    }


    //数据是否匹配
    _isDataMatch(cfgData, matchData) {
        for (let key in matchData) {
            if (cfgData[key] != matchData[key]) {
                return false;
            }
        }
        return true
    }

    //匹配数据转化为索引
    _matchData2Key(matchData) {
        let key = name;
        for (let k in matchData) {
            key += ("#" + k + "#" + matchData[k]);
        }
        return key;
    }

    //通过kv组获取配置数据
    getByUnique(name, ...kv) {
        if (kv.length % 2 != 0) {
            throw "参数不匹配，需要k v 一组";
        }

        if (kv.length == 2) {
            if (kv[0] == "ID") {
                return this.get(name, kv[1]);
            }
        }

        let key = name;
        for (let value in kv) {
            key += "#" + value;
        }

        let list = this.getByList(name, ...kv);
        if (list.length == 0) {
            return null;
        }
        return list[0];
    }

    getByList(name, ...kv) {
        if (kv.length % 2 != 0) {
            throw "参数不匹配，需要k v 一组";
        }

        let key = name;
        for (let index in kv) {
            key += "#" + kv[index];
        }

        let result = this._keyOfDataResultMap[key];
        if (result != null) {
            return result;
        }

        let fieldMap = {};
        let index = 0;
        let length = kv.length;
        while (index < length) {
            let k = kv[index];
            fieldMap[k] = kv[index + 1];
            index = index + 2;
        }
        result = this._getInfoFindByField(name, fieldMap);
        this._keyOfDataResultMap[key] = result;
        return result;
    }

    /**
     * 方法说明 获取配置表长度
     * @public true
     * @method getConfigLength
     * @param name 配置表名字from ConfigName获取
     * @return 配置表长度
     */
    getConfigLength(name) {
        let configData = this._getConfigData(name);
        return this._getObjectSize(configData)
    }


    /**
     * 方法说明 获取配置表长度
     * @public false
     * @method _getObjectSize
     * @param the_object 对象
     * @return 对象长度
     */
    _getObjectSize(the_object) {
        let object_size = 0;
        for (let key in the_object) {
            if (the_object.hasOwnProperty(key)) {
                object_size++;
            }
        }
        return object_size;
    }

    //通过多个key-value 找出对应的配置数据
    _getInfoFindByField(name, fieldMap) {
        let configData = this._getConfigData(name);

        let result = [];
        for (let id in configData) {
            let config = configData[id];
            let flag = true;
            for (let fieldKey in fieldMap) {
                let fieldValue = fieldMap[fieldKey];
                if (fieldValue != config[fieldKey]) {
                    flag = false;
                }
            }
            if (flag) {
                result.push(config);
            }
        }
        return result;
    }

    _addConfigData(name, obj) {
        this._configDataMap[name] = obj;
    }

    _getConfigData(name) {
        return this._configDataMap[name];
    }

    _loadAllConfig(complete) {
        let loadCount = 0;
        let completeCount = 0;
        for (let key in ConfigName) {
            loadCount++;
            let name = ConfigName[key];
            this._loadConfig(name, (obj) => {
                this._addConfigData(name, obj);
                completeCount++;
                // if(loadCount == completeCount){
                complete.call(this);
                // }
            })
        }
    }

    getTotalCount() {
        let i = 0;
        for (let k in ConfigName) {
            i++;
        }
        return i;
    }

    _loadConfig(name, callback) {
        let url = "config/" + name;
        cc.loader.loadRes(url, (err, obj) => {
            if (err == null) {
                //logger.error("!!!!!!!配置文件 : %s!!!!!!!!!!", name);
                callback.call(this, obj);
            } else {
                logger.error("!!!!!!!要加载的配置文件出错:%s!!!!!!!!!!", err);
                callback.call(this, null);
            }
        })

    }

    getConfigByPowerAndID(type, id) {
        let configName = "ItemConfig"
        let iconFolder = "itemIcon"
        let info = nil
        if (type == GamePowerConfig.Item) {
            // 道具
        } else if (type == GamePowerConfig.Resource) {
            // 资源
            configName = "ResourceConfig"
            iconFolder = "resourceIcon"
        } else if (type == GamePowerConfig.Soldier) {
            // 兵种
            configName = "ArmKindsConfig"
            iconFolder = "barrack2Icon"// "armIcon"        
        } else if (type == GamePowerConfig.General) {
            // 武将
            configName = "WarriorsConfig"
            iconFolder = "generalSmall"// 待改        
        } else if (type == GamePowerConfig.Ordnance) {
            // 军械
            configName = "OrdnanceConfig"
            iconFolder = "partsIcon"
        } else if (type == GamePowerConfig.OrdnanceFragment) {
            // 军械碎片
            configName = "OrdnancePieceConfig"
            iconFolder = "partsIcon"
        } else if (type == GamePowerConfig.Counsellor) {
            // 谋士
            configName = "CounsellorConfig"
            iconFolder = "counsellorIcon"
        } else if (type == GamePowerConfig.Hero) {
            // 武将（英雄）
            configName = "HeroConfig"
            iconFolder = "heroIcon"
        } else if (type == GamePowerConfig.HeroTreasure) {
            // 宝具
            configName = "TreasureBaseConfig"
            iconFolder = "heroTreasureIcon"
        } else if (type == GamePowerConfig.HeroTreasureFragment) {
            // 宝具碎片
            configName = "TreasurePieceConfig"
            iconFolder = "heroTreasureIcon"
        } else if (type == GamePowerConfig.LimitActivityItem) {
            // 限时活动特殊物品
            configName = "LimitNatureConfig"
            iconFolder = "limitItemIcon"
        } else if (type == GamePowerConfig.SoldierBarrack) {
            configName = "ArmKindsConfig"
            iconFolder = "barrackIcon"
        } else if (type == GamePowerConfig.Skill) {
            configName = "SkillConfig"
            iconFolder = "skillIcon"
        } else if (type == GamePowerConfig.Building || type == GamePowerConfig.Command) {
            configName = "ArmKindsConfig"
            iconFolder = "building2Icon"

            info = {}
            info.iconFolder = iconFolder
            info.icon = id
            info.color = 1
        } else if (type == GamePowerConfig.Collection) {
            // 收藏资源图片
            configName = "ArmKindsConfig"
            iconFolder = "collection"

            info = {}
            info.iconFolder = iconFolder
            info.icon = id
            info.color = 1
        } else if (type == GamePowerConfig.HeroFragment) {
            configName = "HeroPieceConfig"
            iconFolder = "heroIcon"
        }

        if (info == nil) {
            info = this.getConfigById(configName, id) || {}
        }
        // 英雄特殊处理icon
        if (type == 409) {
            info.icon = info.icon
        }
        if (info.icon == nil) {
            // 容错红包
            info.url = "images/itemIcon/101.png"
        } else {
            if (type == 401) {
                if (info.icon >= 20000) {
                    // icon从20000起的道具图标放在文件夹item2Icon下
                    iconFolder = "item2Icon"
                }
            }
            if (iconFolder == "counsellorIcon") {
                info.url = "images/" + iconFolder + "/" + info.head + ".png"
            } else {
                info.url = "images/" + iconFolder + "/" + info.icon + ".png"
            }
        }
        info.iconFolder = iconFolder
        info.icon = info.icon || 0

        if (iconFolder == "counsellorIcon") {
            info.icon = info.head
        }

        if (info.quality != nil) {
            info.color = info.quality
        }
        // if type == 402 || type == 404 || type == 405 ){
        //     info.color = info.quality
        // }
        if (info.color == nil) {
            info.color = 1
        }

        return info
    }
}

let manager = new ConfigDataManager();

export default manager;