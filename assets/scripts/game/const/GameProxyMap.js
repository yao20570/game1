/**
 * Created by on 2017/10/14.
 */
import GameProxy from "GameProxy";

import RoleProxy from "RoleProxy";
import SystemProxy from "SystemProxy";
import BuildingProxy from "BuildingProxy";
import ChatProxy from "ChatProxy"
import SoldierProxy from "SoldierProxy";
import BanditDungeonProxy from "BanditDungeonProxy";
import BattleProxy from "BattleProxy";
import LegionProxy from "LegionProxy";
//Import:Creator自动注册标记
//上面这句必须存在，用Creator创建模块时自动添加代码的标记

let GameProxyMap = {};
GameProxyMap[GameProxy.Role] = RoleProxy;
GameProxyMap[GameProxy.System] = SystemProxy;
GameProxyMap[GameProxy.Building] = BuildingProxy;
GameProxyMap[GameProxy.Chat] = ChatProxy;
GameProxyMap[GameProxy.Soldier] = SoldierProxy;
GameProxyMap[GameProxy.BanditDungeon] = BanditDungeonProxy;
GameProxyMap[GameProxy.Battle] = BattleProxy;
GameProxyMap[GameProxy.Legion] = LegionProxy;
//Class:Creator自动注册标记
//上面这句必须存在，用Creator创建模块时自动添加代码的标记
export default GameProxyMap;