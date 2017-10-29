/**
 * Created by on 2017/10/14.
 */

import GameState from "GameState";

import LoginState from "LoginState";
import SceneState from "SceneState";
import UpdateState from "UpdateState";
import TestState from "TestState";

let GameStateMap = {};
GameStateMap[GameState.Login] = LoginState;
GameStateMap[GameState.Scene] = SceneState;
GameStateMap[GameState.Update] = UpdateState;
GameStateMap[GameState.Test] = TestState;


export default GameStateMap;