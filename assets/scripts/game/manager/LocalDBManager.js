import GameConfig from "GameConfig"

class LocalDBManager {

    setValueForKey(key, value, isGloble) {

        let mainKey = ""
        if (isGloble != true) {
            mainKey = GameConfig.serverId + GameConfig.actorid
        }

        key = "L" + mainKey + key


        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    }

    getValueForKey(key, isGloble, extraKey) {

        let mainKey
        if (isGloble == true) {
            mainKey = ""
        } else if (extraKey != nil) {
            mainKey = GameConfig.serverId + GameConfig.accountName
        } else {
            mainKey = GameConfig.serverId + GameConfig.actorid
        }
        key = "L" + mainKey + key

        let value = JSON.parse(cc.sys.localStorage.getItem(key));
        if (value == "") {
            value = nil
        }
        return value
    }

}





export default new LocalDBManager()


