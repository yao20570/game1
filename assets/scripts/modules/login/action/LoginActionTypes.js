/**
 * Created by on 2017/9/26.
 */
const LoginActionType = {
    GET_SERVER_LIST : "GET_SERVER_LIST",  //获取服务器列表
    SELECT_SERVER : "SELECT_SERVER",  //选择服务器
    ENTER_GAME : "ENTER_GAME", //进入游戏
    CONNECT_SERVER : "CONNECT_SERVER", //连接服务器    
    RESP_LOGIN_GATE : "RESP_LOGIN_GATE", //登录网关返回
    SHOW_OTHER_EVENT : "SHOW_OTHER_EVENT", //进入其他模块
    CLOSE_LOADER_MODULE : "CLOSE_LOADER_MODULE", //关闭loaderModule
};

export default LoginActionType;