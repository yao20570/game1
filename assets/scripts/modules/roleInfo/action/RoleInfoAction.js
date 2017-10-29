import BasicAction from "BasicAction";
import RoleInfoActionTypes from "RoleInfoActionTypes";
import GameProxy from "GameProxy";
import {PlayerPowerDefine,PlayerPowerBuildType,ResCollectionIcon} from "PlayerPowerDefine";

export default class RoleInfoAction extends BasicAction{

    showOtherHandler(data){
        this.dispatch(RoleInfoActionTypes.SHOW_OTHER_EVENT, data)
    }

    loadComplete(){
        this.dispatch(RoleInfoActionTypes.LOAD_COMPLETE, null)
    }

    initRoleData(){
        let roleProxy = this.getProxy(GameProxy.Role)
        let actorInfo = roleProxy.getActorInfo()
        //名字
        let playerName = actorInfo.name
        let vipLevel = roleProxy.getRoleAttrValue(PlayerPowerDefine.POWER_vipLevel)
        let goldNum= roleProxy.getRoleAttrValue(PlayerPowerDefine.POWER_gold)
        
        //等级哦
        let level = roleProxy.getRoleAttrValue(PlayerPowerDefine.POWER_level)
        //银铁木石头食物
        let names = [
            "tael",
            "iron",
            "wood",
            "stones",
            "food",
        ]
        let resourceAttr = []
        for(let i = 0; i < names.length; i++){
            let name = names[i]
            resourceAttr.push({
                val:roleProxy.getRoleAttrValue(PlayerPowerDefine["POWER_" + name]),
                capacity:roleProxy.getRoleAttrValue(PlayerPowerDefine["POWER_" + name + "_Capacity"]),
            })
        }
        let data = {
            name:playerName,
            level:level,
            vipLevel:vipLevel,
            goldNum:goldNum,
            resourceAttr:resourceAttr,
        }
        this.dispatch(RoleInfoActionTypes.INIT_ROLE_DATA,data)
    }
}