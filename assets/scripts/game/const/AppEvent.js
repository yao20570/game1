
let AppEvent = {};

//--模块事件
//AppEvent.MODULE_EVENT = "module_event";
AppEvent.MODULE_OPEN_EVENT = "module_open_event" ;
AppEvent.MODULE_LOADING_OPEN_EVENT = "module_loading_open_event"; //--通过加载界面打开模块
AppEvent.MODULE_CLOSE_EVENT = "module_close_event" ;
AppEvent.MODULE_FINALIZE_EVENT = "module_finalize_event" ;//--模块释放事件

//--状态事件
AppEvent.GAME_STATE_EVENT = "game_state_event";
AppEvent.GAME_STATE_CHANGE_EVENT = "game_state_change_event";

//--场景事件
AppEvent.SCENE_EVENT = "scene_event";
AppEvent.SCENE_ENTER_EVENT = "scene_enter_event";
AppEvent.SCENEMAP_MOVE_UPDATE = "scenemap_move_update";  //--更新主城地图坐标

//--游戏事件
AppEvent.GAME_EVENT = "game_event";
AppEvent.GAME_LOGOUT_EVENT = "game_logout_event";
AppEvent.GAME_SCENE_LOGIN_EVENT = "game_scene_login_event"; //--在场景中登录游戏

//--网络事件
AppEvent.NET_EVENT = "net_event";
AppEvent.NET_SEND_DATA = "net_send_data" ;//--发送数据
AppEvent.NET_RECV_DATA = "net_recv_data" ;//--接收数据
AppEvent.NET_START_CONNECT = "net_start_connect"; //--开始网络链接
AppEvent.NET_SUCCESS_CONNECT = "net_success_connect" ;//--成功连接上网络
AppEvent.NET_FAIL_CONNECT = "net_fail_connect"; //--连接失败
AppEvent.NET_SUCCESS_RECONNECT = "net_success_reconnect" ;//--重新连接成功
AppEvent.NET_HAND_CLOSE_CONNECT = "net_hand_close_connect"; //--请求手动网络关闭
AppEvent.NET_AUTO_CLOSE_CONNECT = "net_auto_close_connect"; //--自动关闭网络，需要重连
AppEvent.NET_FAILURE_RECONNECT = "net_failure_reconnect" ;//--重连失败
AppEvent.NET_LOGIN_GATEWAY = "net_login_gateway"//登录网关
AppEvent.NET_LOGIN_GATEWAY_SUCCESS = "net_login_gateway_success"//登录网关
//---------------系统SystemProxy
AppEvent.PROXY_SYSTEM_LOGINGATE = "proxy_system_logingate" //网关登录
AppEvent.PROXY_SYSTEM_OTHERLOGIN = "proxy_system_otherlogin" //被动退出
AppEvent.PROXY_SYSTEM_HEARTBEAT = "proxy_system_heartbeat" //心跳
AppEvent.PROXY_SYSTEM_LOGIN = "proxy_system_login" //登录
AppEvent.PROXY_SYSTEM_CHARGESUCESS = "proxy_system_chargesucess" //充值成功

//-------------loader event -----
AppEvent.LOADER_MAIN_EVENT = "loader_main_event" ;//--加载事件
AppEvent.LOADER_UPDATE_PROGRESS = "loader_update_progress"; //--进度更新
AppEvent.LOADER_UPDATE_STATE = "loader_update_state" ;//--更新状态
AppEvent.LOADER_START = "loader_start" ;//--加载开始

//--------------role event-------------
AppEvent.PROXY_UPDATE_ROLE_INFO = "proxy_update_role_info";
AppEvent.PROXY_CREATE_ROLE_SUCCESS = "proxy_create_role_success";
AppEvent.PROXY_GET_ROLE_INFO = "proxy_get_role_info";

//--------------Chat event-------------
AppEvent.GET_CHATINFO = "proxy_get_chatinfo"

//--------------------剿匪副本----------------
AppEvent.PROXY_BANDIT_DUNGEON_UPDATE = "proxy_bandit_dungeon_update"  //剿匪副本更新
AppEvent.PROXY_BANDIT_IS_ALL_KILL = "proxy_bandit_is_all_kill" //击杀所有黄巾贼

//--------------------战斗---------------------
AppEvent.PROXY_BATTLE_START = "proxy_battle_start" //战斗开始
AppEvent.PROXY_BATTLE_END = "proxy_battle_end"  //战斗结束
AppEvent.POWER_VALUE_UPDATE = "power_value_update" //属性变化

//-------------proto--------------
AppEvent.NET_M1 = 1  //登录协议
AppEvent.NET_M1_C8888 = 8888 //心跳

AppEvent.NET_M1_C9988 = 9988 //退出排队系统
AppEvent.NET_M1_C9998 = 9998 //通知异地登陆
AppEvent.NET_M1_C9999 = 9999 //登录网关
AppEvent.NET_M1_C10000 = 10000 //登录游戏
AppEvent.NET_M1_C10001 = 10001
AppEvent.NET_M1_C10002 = 10002 //登录后的事件ID 只能记录登录成功的

//角色信息
AppEvent.NET_M2 = 2
AppEvent.NET_M2_C20000 = 20000 //请求角色信息
AppEvent.NET_M2_C20001 = 20001  //角色军衔升级
AppEvent.NET_M2_C20002 = 20002  //角色属性更改
AppEvent.NET_M2_C20003 = 20003  //角色繁荣等级升级
AppEvent.NET_M2_C20004 = 20004  //角色统帅等级升级
AppEvent.NET_M2_C20005 = 20005  //角色授勋领取声望
AppEvent.NET_M2_C20007 = 20007  //发送各种背包刷新
AppEvent.NET_M2_C20008 = 20008  //创建角色
AppEvent.NET_M2_C20009 = 20009  //奖励飘字
AppEvent.NET_M2_C20010 = 20010  //领取状态
AppEvent.NET_M2_C20011 = 20011  //购买体力
AppEvent.NET_M2_C20012 = 20012  //设置头像
AppEvent.NET_M2_C20013 = 20013  //是否可购买体力  
AppEvent.NET_M2_C20014 = 20014  //设置玩家坐标
AppEvent.NET_M2_C20015 = 20015  //开服礼包的信息
AppEvent.NET_M2_C20016 = 20016  //每日等了礼包的信息
AppEvent.NET_M2_C20017 = 20017  //每日登陆首次领取声望状态
AppEvent.NET_M2_C20018 = 20018  //野外讨伐令购买
AppEvent.NET_M2_C20200 = 20200  //主界面的提示
AppEvent.NET_M2_C20201 = 20201  //更新军团名字
AppEvent.NET_M2_C20300 = 20300  //设置通知选项
AppEvent.NET_M2_C20301 = 20301  //领取新手礼包
AppEvent.NET_M2_C20400 = 20400  //最近联系人
AppEvent.NET_M2_C20500 = 20500  //繁荣定时器
AppEvent.NET_M2_C20501 = 20501  //体力定时器
AppEvent.NET_M2_C20502 = 20502  //讨伐令定时器
AppEvent.NET_M2_C20600 = 20600  //民心刷新奖励
AppEvent.NET_M2_C20601 = 20601  //领取奖励
AppEvent.NET_M2_C20802 = 20802  //称号选择
AppEvent.NET_M2_C20800 = 20800  //服务器主动推送称号
AppEvent.NET_M2_C20805 = 20805  //选择头像框
AppEvent.NET_M2_C20806 = 20806  //服务器主动推送称号
AppEvent.NET_M2_C20807 = 20807  //推送已双倍充值的额度
AppEvent.NET_M2_C20808 = 20808  //手动升级
AppEvent.NET_M2_C20301 = 20301  //领取新手礼包

//聊天
AppEvent.NET_M14 = 14              // 聊天协议
AppEvent.NET_M14_C140000 = 140000   //发送聊天数据

// 建筑协议
AppEvent.NET_M28 = 28
AppEvent.NET_M28_C280001 = 280001 //建筑请求升级 包括建造（0级升1级）
AppEvent.NET_M28_C280002 = 280002 //请求完成升级, 正常升级
AppEvent.NET_M28_C280003 = 280003 //取消建筑升级
AppEvent.NET_M28_C280004 = 280004 //建筑加速升级, 加速升级
AppEvent.NET_M28_C280005 = 280005 //野外建筑拆除
AppEvent.NET_M28_C280006 = 280006 //建筑生产 包括 兵营，校场，工匠坊，科技
AppEvent.NET_M28_C280007 = 280007 //请求生产完成
AppEvent.NET_M28_C280008 = 280008 //取消生产 
AppEvent.NET_M28_C280009 = 280009 //加速生产
AppEvent.NET_M28_C280011 = 280011 //VIP购买建筑位
AppEvent.NET_M28_C280012 = 280012 //购买自动升级建筑
AppEvent.NET_M28_C280013 = 280013 //自动升级建筑开关
AppEvent.NET_M28_C280014 = 280014 //完成自动升级建筑 升级建筑倒计时已经结束
AppEvent.NET_M28_C280015 = 280015 //资源自动产出(也是心跳)
AppEvent.NET_M28_C280016 = 280016
AppEvent.NET_M28_C280017 = 280017

//剿匪副本
AppEvent.NET_M34 = 34 
AppEvent.NET_M34_C340000 = 340000   //副本数据同步，休整时间结束后，才会请求
AppEvent.NET_M34_C340001 = 340001   //请求剿匪副本战斗
AppEvent.NET_M34_C340002 = 340002   //剿匪副本全体刷新

export default AppEvent;