import FluxReduceStore from "FluxReduceStore";
import RoleInfoActionTypes from "RoleInfoActionTypes";

export default class RoleInfoStore extends FluxReduceStore {

    getInitialState() {
        return Immutable.fromJS({
            // attrInfos : null,
            name : "",                  //角色名
            level:0,
            vipLevel:0,                 
            goldNum:0,
            resourceAttr:[],            //[{val,capacity}]银两 铁锭 石料 木头 粮食



            // worldTileX : null, 		//世界坐标 -1表示未开启
            // worldTileY : null,
            // playerId : null, 		//玩家ID
            // iconId :null,      		//头像ID
            // pendantId :null,   		//挂件ID
            // legionId :null,   	//军团id没有是-1
            // legionName : null,  	//军团名字
            // legionLevel :null,    //军团等级
            // newGift : null,		//是否领取过新手礼包：0未领取，1已领
            // fameState : null,		//声望是否领取
            // engryprice:null,		//购买体力价格
            // boomRefTime:null,		//繁荣度恢复到满剩余时间
            // energyRefTime:null,	//体力恢复到满剩余时间
            // totalOnlineTime:null, //玩家在线时长（秒）在线好礼活动专用
            // tanbaoFrees:null,     //探宝免费次数类型根据下标定    
            // fightCount : null,	//西域远征剩余挑战次数
            // backCount : null,		//西域远征剩余重置次数
            // nextOpenId:null,//下一个要开启的活动id
            // nextOpenTime:null,//下一个要开启的时间
            // nextLimtOpenTime:null,//下一个要限时活动开启的时间
            // nextLimtOpenId:null,//下一个要限时开启的活动id
            // crusadeEnergyTime:null,//讨伐令恢复时间
            // supportRefresh:null,//民心刷新次数
            // legionLeaderX : null, //军团长世界X坐标 -1表示没有
            // legionLeaderY : null, //军团长世界X坐标 -1表示没有
            // crusadeEnergyPrice : null,//购买野外讨伐令价格
            // roleCreateTime : null,  //角色创建时间
            // worldSeedTypeId : null,//世界种子typeid
            // teacherId : null,   //师门id
            // isFinishLearn : null, //是否已出师 0-否 1-是
            // teacherType : null, //1-师傅 2-徒弟
            // teacherDesign : null, //师门称号
            // customHeadStatus : null, //自定义头像状态
            // customCoolTime : null, //自定义头像上传冷却时间
        });
    }

    reduce(state, action) {
        switch (action.type) {
            case RoleInfoActionTypes.INIT_ROLE_DATA:
                let data = action.data
                for(let key in data){
                    state = state.set(key,data[key])
                }
                return state
            default:
                return state;
        }
    }
}