/**********************************
*业务逻辑的枚举在这里定义
***********************************/


//游戏对应power值
export let GamePowerConfig = {
    Item: 401,//道具
    General: 402,//武将
    Resource: 407,//资源
    Soldier: 406,//佣兵
    Ordnance: 403,//军械
    OrdnanceFragment: 404,//军械碎片
    Counsellor: 405,//谋士 ？？
    Hero: 409,//武将
    HeroTreasure: 410,//宝具
    HeroTreasureFragment: 411,//宝具碎片
    HeroFragment: 412,//武将碎片
    LimitActivityItem: 413,//限时活动特殊物品
    Command: 4060,//司令部 -特殊icon
    Skill: 4061,//技能 -
    SoldierBarrack: 4062,//佣兵图片
    Building: 4063,//普通建筑图片\building2Icon
    Collection: 4064,//收藏资源图片\collection
    Other: 666,//其他icon图片（任务、主公等）
    Product: 6666,//主城生产图标
    Reward: 6667,//奖励图标
    CitySkill: 6668,//城主战技能图标
}

export let BattleType = {
    level: 1,//战役
    explore: 2,//探险
    arena: 3,//演武场
    world: 4,//世界战斗
    world_def: 5,//世界战斗防守
    legion: 6,//军团试炼场
    world_boss: 7,//世界Boss
    qunxiong: 8,//群雄逐鹿
    kill: 9,//剿匪
    west: 10,//西域远征
    lordCity_boss: 11,// 城主BOSS战
    lordCity_pvp: 12,// 城主玩家攻防（PVP）
    lordCity_city: 13,// 城主城墙战
    rebles: 14,// 乱军来袭
    palyerRes: 15,// 世界战斗有人矿点
    city_pvp: 16,// 郡城盟战pvp
    city_pve: 17,// 郡城盟战pve
    emperor_city: 18,// 郡城盟战pve
}

