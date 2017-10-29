/**
 * Created by  on 2017/9/19.
 */

let GameConfig = {};

/////////////服务器配置相关情况//////////////////////
GameConfig.serverIp = "192.168.10.124";  //服务器地址
GameConfig.port = 8080;  //服务器端口
GameConfig.accountName = "";  //账号名
GameConfig.serverName = ""; //--服务器名字
GameConfig.serverArea = ""; // --服务器区，服务器区 对应server_no
GameConfig.serverId = ""; // --服务器唯一ID 后台以这个为准
GameConfig.serverState = 1; // --服务器状态
GameConfig.gameId = "102"; //游戏id

//////////////客户端相关//////////////////////
GameConfig.osName = ""; // --系统名称
GameConfig.platformChanleId = -1; // --平台ID
GameConfig.channelId = 0; // --子渠道ID
GameConfig.localVersion = 0; // --对应热更时的小版本号
GameConfig.mainVersion = 0; //主版本
GameConfig.clientVersion = "0.0"; //客户端版本 主+子
GameConfig.isTest = 1; // --是否为测试包 1测试 2正式 3运营

/////////////////相关请求地址url//////////////////////////////
GameConfig.local_admincenter_api_url = "http://192.168.10.138:8001/gcol/"; // --本地中央服接口
GameConfig.admincenter_api_url = "http://center.znlgame.com:8888/gcol/"; //  --中央接口服
GameConfig.server_list_url = GameConfig.admincenter_api_url;

///////////////// 时间相关
GameConfig.serverTime = new Date(); //服务器时间，一段时间后，通过心跳包 去同步时间
GameConfig.lastHeartbeatTime = new Date(); //最后的心跳时间
GameConfig.enterBackgroundTime = 0; //回到后台时间

GameConfig.isLoginSucess = false
GameConfig.isServerFull = false

//角色相关
GameConfig.actorid = 0

export default GameConfig;
