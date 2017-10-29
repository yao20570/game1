/**
 * Created by on 2017/10/14.
 */

import GameModule from "GameModule";

import LoginModule from "LoginModule";
import LoaderModule from "LoaderModule";
import MainSceneModule from "MainSceneModule";
import ToolbarModule from "ToolbarModule";
import RoleInfoModule from "RoleInfoModule";
import ChatModule from "ChatModule";
import ActivityModule from "ActivityModule";
import CreateRoleModule from "CreateRoleModule";
import MapModule from "MapModule";
import BattleModule from "BattleModule";
import SceneModule from "SceneModule";
//Import:Creator自动注册标记
//上面这句必须存在，用Creator创建模块时自动添加代码的标记

let GameModuleMap = {};
GameModuleMap[GameModule.LoginModule] = LoginModule;

GameModuleMap[GameModule.LoaderModule] = LoaderModule;
GameModuleMap[GameModule.MainSceneModule] = MainSceneModule;
GameModuleMap[GameModule.ToolbarModule] = ToolbarModule;
GameModuleMap[GameModule.RoleInfoModule] = RoleInfoModule;
GameModuleMap[GameModule.ChatModule] = ChatModule;
GameModuleMap[GameModule.ActivityModule] = ActivityModule;
GameModuleMap[GameModule.CreateRoleModule] = CreateRoleModule;
GameModuleMap[GameModule.MapModule] = MapModule;
GameModuleMap[GameModule.BattleModule] = BattleModule;
GameModuleMap[GameModule.SceneModule] = SceneModule;
//Name:Creator自动注册标记
//上面这句必须存在，用Creator创建模块时自动添加代码的标记

/**
 * 场景模块的，在这里加入
 * @type {Array}
 */
let SceneModuleNameList = [
    GameModule.LoaderModule,
    GameModule.MainSceneModule,
    GameModule.ToolbarModule,
    GameModule.RoleInfoModule,
    GameModule.ChatModule,
    GameModule.ActivityModule,
    GameModule.CreateRoleModule,
    GameModule.MapModule,
    GameModule.BattleModule,
    GameModule.SceneModule,
    //Class:Creator自动注册标记
    //上面这句必须存在，用Creator创建模块时自动添加代码的标记
    //!!!!!!!!!!!!!!注意，如果创建的模块不属于SceneModule则需要手动删除!!!!!!!!!!!!!!!!!!!
];

////////////////////////////////////////////////////////////

GameModuleMap.getModule = (name) => {
    return GameModuleMap[name];
};

GameModuleMap.getSceneModuleNameList = () => {
    return SceneModuleNameList;
};

export default GameModuleMap;