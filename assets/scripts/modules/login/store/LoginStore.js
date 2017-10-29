/**
 * Created by on 2017/9/25.
 */
import FluxReduceStore from "FluxReduceStore";
import LoginActionTypes from "LoginActionTypes";
import Server from "Server";

export default class LoginStore extends FluxReduceStore {

    getInitialState() {
        return Immutable.fromJS({
            selectServer: null,
            playerAccount: null,
            serverList: []
        });
    }

    reduce(state, action) {
        switch (action.type) {
            case LoginActionTypes.GET_SERVER_LIST:
                return this.changeToServerMap(state, action.data);
                break;
            case LoginActionTypes.SELECT_SERVER:
                let server = action.data;
                let selectServer = state.get("selectServer");
                if(server.serverId == selectServer.serverId){
                    return state;  //一样的选择id，直接返回，不刷新
                }
                return state.set("selectServer", action.data);
            default:
                return state;
        }
    }

    changeToServerMap(state, data){
        let info = data.info;
        let selectServerId = data.selectServerId;
        let playerAccount = data.playerAccount;
        let serverList = [];
        let serverInfoList = info.split(";");
        let selectServer = null;
        let defaultSelectServer = null;
        serverInfoList.forEach( (infoStr) => {
            let server = Server.valueOf(infoStr);
            if(server.serverId >= 9000){
                serverList.push(server);
                defaultSelectServer = server;
                if(selectServerId == server.serverId){
                    selectServer = server;
                }
            }
        });
        if(selectServer == null){
            selectServer = defaultSelectServer;
        }

        let resultState = state;
        if(playerAccount != null){
            resultState = resultState.set("playerAccount", playerAccount);
        }

        resultState = resultState.set("serverList", serverList);
        resultState = resultState.set("selectServer", selectServer);
        return resultState;
    }



}