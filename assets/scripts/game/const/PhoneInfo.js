import GameConfig from "GameConfig";
import logger from "Logger";

class PhoneInfo{

    init(info){
        //let targetPlatform= cc.Application.getInstance().getTargetPlatform()
        let targetPlatform= cc.sys.platform
        let os = 4
        if(targetPlatform == cc.PLATFORM_OS_ANDROID){
            os = 1
        }
        else if( targetPlatform == cc.PLATFORM_OS_IPHONE 
            || targetPlatform == cc.PLATFORM_OS_IPAD){
            os = 2
            }
        else if( targetPlatform == cc.PLATFORM_OS_WINDOWS){
            os = 3
        }
        info["os"] = os
        
        GameConfig.osName = this.getOsName(os)
        
        let frameSize = cc.view.getFrameSize()
        let screen = frameSize.width + "x" + frameSize.height
        info["screen"] = screen
        
        
        GameConfig.platformChanleId = info["plat_id"] || -1
        
        if(info["mac"] != null){
            info["imei"] = info["imei"] || "null"
            let utma = AppUtils.calcMD5(info["model"] + info["mac"] + info["imei"])
            info["utma"] = utma
        }
        else{
            info["utma"] = ""
        }
        
        if(targetPlatform == cc.PLATFORM_OS_IPHONE 
            || targetPlatform == cc.PLATFORM_OS_IPAD){
            let utma =  AppUtils.calcMD5(info["imei"])
            info["utma"] = utma
        }
        
        if(info["isOpenCharge"] != null && 
            (info["isOpenCharge"] == "false" || info["isOpenCharge"] == false )){
            GameConfig.isOpenCharge = false
        }
        
        if(info["isShowLogo"] != null && 
            (info["isShowLogo"] == "false" || info["isShowLogo"] == false )){
            GameConfig.isShowLogo = false
        }
        
        if(info["autoLoginDebug"] != null && 
            (info["autoLoginDebug"] == "true" || info["autoLoginDebug"] == true )){
            GameConfig.autoLoginDebug = true
            GameConfig.platformChanleId = 9988 //给没有SDK登录的写死一个渠道ID
        }
    
        if(info["isTriggerGuide"] != null && 
            (info["isTriggerGuide"] == "false" || info["isTriggerGuide"] == false )){
            GameConfig.isTriggerGuide = false
        }
    
        if(info["isFullPackage"] != null && 
            (info["isFullPackage"] == "false" || info["isFullPackage"] == false )){
            GameConfig.isFullPackage = false
        }
    
        if(info["isActivation"] != null && 
            (info["isActivation"] == "false" || info["isActivation"] == false )){
            GameConfig.isActivation = false
        }
    
        if(info["channelId"] != null){
            GameConfig.channelId = info["channelId"]
        }
        
        GameConfig.logoId = info["logoId"] || 0
    
        if(info["versionUrl"] != null && info["versionUrl"] != ""){
            GameConfig.phoneVersionUrl = info["versionUrl"]
        }
    
        if(typeof info["phoneVersion"] == "string" &&  info["phoneVersion"] != ""){
            GameConfig.phoneVersion = info["phoneVersion"]
        }
        
        this._info = info
    }
    

//拿到即将要发送给服务器的手机信息
getPackPhoneInfo(){
    let data = {}
    data["utma"] = this.getInfoByKey("utma") || ""
    data["imei"] = ( (this.getInfoByKey("mac") || "" ) + "_" + (this.getInfoByKey("imei") || "") ) || ""
    data["screen"] = this.getInfoByKey("screen") 
    data["os"] = this.getInfoByKey("os")
    data["model"] = this.getInfoByKey("model") || ""
    data["net"] = this.getNetName(this.getInfoByKey("net") || "") 
    data["operators"] = this.getOperators(this.getInfoByKey("operators") || "") 
    data["location"] = this.getInfoByKey("location") || ""
    data["package_name"] = this.getInfoByKey("package_name") || ""
    data["package_size"] = this.getInfoByKey("package_size") || ""
    data["plat_id"] = this.getInfoByKey("plat_id") || GameConfig.platformChanleId
    data["game_version"] = GameConfig.version
    
    let phoneInfo = this.reGetPhoneInfo() //登录时再去拿一遍。pushChannelId初始化会满 这里只能拿pushChannelId
    data["pushChannelId"] = phoneInfo["pushChannelId"] || ""
    data["channal_id"] = phoneInfo["channelId"] || 0
    
    let phoneVersion = this.getInfoByKey("phoneVersion")
    if(typeof phoneVersion == "string" && phoneVersion != ""){
        data["os_version"] = phoneVersion
    }
    return data
}
    

getLoginData(account, areId){
    let data = this.getPackPhoneInfo()
    data["account"] = account
    data["areId"] = areId
    return data
}

getOsName(os){
    let name = "other"
    if(os == 1){
        name = "android"
    }
    else if( os == 2){
        name = "ios"
    }
    else if( os == 3){
        name = "windows"
    }
    return name
}
    

getNetName(net){
    let name = "other"
    if(net == 1){
        name = "2G"
    }
    else if( net == 2){
        name = "3G"
    }
    else if( net == 3){
        name = "wifi"
    }
    return name
}
    

getOperators(operators){
    let name = "其他"
    if(operators == 1){
        name = "中国移动"
    }
    else if( operators == 2){
        name = "中国联通"
    }
    else if( operators == 3){
        name = "中国电信"
    }
    return name
}
    

reGetPhoneInfo(){
    // let phoneInfo =AppUtils.getPhoneInfo() || ""
    // logger.error("~~~not==error==getPhoneInfo=~~~.%s~~~", phoneInfo)
    // require("json")
    // let function decode()
    //     let result = json.decode(phoneInfo)
    //     return result
    // }
    // let status, phoneInfoData = pcall(decode)
    // if(status != true){
    //     logger.error("~~~~~~~PhoneInfo解析失败~~~~~~~~~~~~~~~")
    //     phoneInfoData = {}
    // }
    
    return {} // phoneInfoData 
}
    


//imei IMEI
//location 地理坐标
//operators 运营商
//model 手机机型
//package_name 游戏包名称
//net 网络 1、2G；2、3G；3、wifi；4、其他
//package_size 游戏包大小(字节数)
//utma 手机唯一标识.md5(imei+手机机型+网卡mac)
//plat_id 平台ID
//screen分辨率
//os操作系统
getInfoByKey(key){
    return this._info[key]
}
    

getPhoneInfo(){
    return this._info
}
    
}

export default new PhoneInfo()



