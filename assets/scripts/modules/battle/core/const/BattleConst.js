/**
 * Created by snow on 2016-12-26.
 */
let ModelAnimation = {}  //模型动作名
ModelAnimation.Attack = "attack"
ModelAnimation.Die = "die"
ModelAnimation.Hurt = "hurt"
ModelAnimation.Run = "run"
ModelAnimation.Wait = "wait"
ModelAnimation.Win = "win"


let ModelDirection = {}  //模型朝向
ModelDirection.Left = 1 //朝左边
ModelDirection.Right = -1  //朝右边

let ModelConsIndex = {}  //军师模型位置
ModelConsIndex.Left = 19 //左边军师
ModelConsIndex.Right = 29  //右边军师


let BattleCamp = {}  //战斗阵营
BattleCamp.Left = 1  //左边阵营
BattleCamp.Right = 2 //右边阵营

let HurtType = {}  //血量变更类型
HurtType.NormalHurt = 1 //普通攻击
HurtType.MagicHurt = 2 //普通攻击
HurtType.CritHurt = 3 //暴击
HurtType.DodgeHurt = 4 //闪避
HurtType.AddHpHurt = 5 //加血
HurtType.OtherHurt = 6 //其他类型
HurtType.RefrainHurt = 7 //克制类型

let HurtEffectType = {} //伤害对应的飘字类型
HurtEffectType[HurtType.NormalHurt] = "BloodMinusEffect"
HurtEffectType[HurtType.MagicHurt] = "BloodMinusEffect"
HurtEffectType[HurtType.CritHurt] = "BloodCritEffect"
HurtEffectType[HurtType.DodgeHurt] = "BloodMinusEffect"
HurtEffectType[HurtType.AddHpHurt] = "BloodMinusEffect"
HurtEffectType[HurtType.OtherHurt] = "BloodMinusEffect"
HurtEffectType[HurtType.RefrainHurt] = "BloodRefrainEffect"


let HurtSkillConf = {}  //高级佣兵攻击特效
HurtSkillConf[1] = { ID: 1, showType: 1, indexMaps: [['A', 1, 3], ['B', 4, 6]] } //固定A/B位播放
HurtSkillConf[2] = { ID: 2, showType: 2, indexMaps: [['C', 1, 6]] }   //固定C位播放
HurtSkillConf[3] = { ID: 3, showType: 3, indexMaps: [['D', 1, 1], ['D', 4, 4], ['E', 2, 2], ['E', 5, 5], ['F', 3, 3], ['F', 6, 6]] }  //固定D/E/F位播放
HurtSkillConf[4] = { ID: 4, showType: 4, indexMaps: [['G', 1, 1], ['H', 2, 2], ['I', 3, 3], ['J', 4, 4], ['K', 5, 5], ['L', 6, 6]] }


export default {ModelAnimation, ModelDirection, ModelConsIndex, BattleCamp, HurtType, HurtEffectType, HurtSkillConf}

//////////////////////////////////////////////////////////////////////////////-


