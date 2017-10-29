/**
 * Created by on 2017/9/20.
 */

 import AppUtils from "AppUtils"


class SDKManager{

    constructor(){

    }

    //获取账号校验码
    getAccountSign(account, areId){
        let value = account + "_" + areId + "_" + "~~~~~@@@@@@@@@$@*&!!znl~~~~~~~~~"
        let xxhash = AppUtils.calcXXHash(value, 0x9747b28c)
        return xxhash
    }

}

export default new SDKManager();