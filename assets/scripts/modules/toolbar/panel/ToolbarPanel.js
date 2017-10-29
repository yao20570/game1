/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import GameModule from "GameModule"

class ToolbarPanel extends BasicPanel {

    initPanel() {
        let mainScene = this.node.getChildByName("mainPanel")
        //////////////////////最底层/////////////////////////////
        let panelBottom1 = mainScene.getChildByName("panelBottom1")
        this._btnScene = panelBottom1.getChildByName("btnScene")
        let layout = panelBottom1.getChildByName("layout")
        let names = [
                        "btnZhanYi",
                        "btnWujiang",
                        "btnTeam",
                        "btnTask",
                        "btnBag",
                        "btnRange",
                    ]
        for(let i = 0; i < names.length; i++){
            let name = names[i]
            this["_" + name] = layout.getChildByName(name)
        }


        /////////////////////聊天 季节 世界等级////////////////////////
        let panelBottom2 = mainScene.getChildByName("panelBottom2")
        
        this._btnSeason = panelBottom2.getChildByName("btnSeason")//季节
        this._btnChat = panelBottom2.getChildByName("btnChat")//聊天
        //////////////////////主线任务 支线任务/////////////////////////
        let panelBottom3 = mainScene.getChildByName("panelBottom3")
        this._btnFirstLine = panelBottom3.getChildByName("btnFirstLine")
        this._btnSecondLine = panelBottom3.getChildByName("btnSecondLine")
        this._btnFirstLine.active = false
        this._btnSecondLine.active = false
        //////////////////////////队列 事件////////////////////////////
        let panelBottom4 = mainScene.getChildByName("panelBottom4")

        //活动快捷入口
        this._LayoutActive = panelBottom4.getChildByName("LayoutActive")
        this._LayoutActive.active = false

        this._btnQuickTask = panelBottom4.getChildByName("btnQuickTask")//日常任务
        this._btnQueue = panelBottom4.getChildByName("btnQueue")//队列


        //////////////////////邮件 增益 朋友 目标//////////////////////
        let panelTop1 = mainScene.getChildByName("panelTop1")
        names = [
            "btnZengYi",
            "btnMail",
            "btnFriend",
            "btnTarget",
        ]
        for(let i = 0; i < names.length; i++){
            let name = names[i]
            this["_" + name] = panelTop1.getChildByName(name)
        }

        ///////////////////////////公告 显示 活动 周卡 酒馆 商城.....///////////////////////////
        let panelTop2 = mainScene.getChildByName("panelTop2")
        names = [
            "btnNotice",
            "btnLimit",
            "btnActive",
            "btnPub",
            "btnShop",
            "btnVipSupport",
            "btnWeekCard",
            "btnGiftBag",
            "btnLegion",
            "btnLock",
        ]
        for(let i = 0; i < names.length; i++){
            let name = names[i]
            this["_" + name] = panelTop2.getChildByName(name)
        }
        this._isShowBtn = true


        //
        this._isInMainScene = true;
    }

    registerEvents() {
        //最底层
        this.addTouchEventListener(this._btnScene, () => this.onBtnScene());
        this.addTouchEventListener(this._btnZhanYi, () => this.onBtnZhanYi());
        this.addTouchEventListener(this._btnWujiang, () => this.onBtnWujiang());
        this.addTouchEventListener(this._btnTeam, () => this.onBtnTeam());
        this.addTouchEventListener(this._btnTask, () => this.onBtnTask());
        this.addTouchEventListener(this._btnBag, () => this.onBtnBag());
        this.addTouchEventListener(this._btnRange, () => this.onBtnRange());

        //聊天 季节 世界等级
        this.addTouchEventListener(this._btnSeason, () => this.onBtnSeason());//季节
        this.addTouchEventListener(this._btnChat, () => this.onBtnChat());//聊天

        //////////////////////主线任务 支线任务/////////////////////////
        this.addTouchEventListener(this._btnFirstLine, () => this.onBtnFirstLine());//主线
        this.addTouchEventListener(this._btnSecondLine, () => this.onBtnSecondLine());//支线
        

        //////////////////////////队列 事件////////////////////////////
        this.addTouchEventListener(this._btnQuickTask, () => this.onBtnQuickTask());//日常任务
        this.addTouchEventListener(this._btnQueue, () => this.onBtnQueue());//队列

        //邮件 增益 朋友 目标
        this.addTouchEventListener(this._btnZengYi, () => this.onBtnZengYi());
        this.addTouchEventListener(this._btnMail, () => this.onBtnMail());
        this.addTouchEventListener(this._btnFriend, () => this.onBtnFriend());
        this.addTouchEventListener(this._btnTarget, () => this.onBtnTarget());

        //公告 显示 活动 周卡 酒馆 商城.....
        this.addTouchEventListener(this._btnNotice, () => this.onBtnNotice());
        this.addTouchEventListener(this._btnLimit, () => this.onBtnLimit());
        this.addTouchEventListener(this._btnActive, () => this.onBtnActive());
        this.addTouchEventListener(this._btnPub, () => this.onBtnPub());
        this.addTouchEventListener(this._btnShop, () => this.onBtnShop());
        this.addTouchEventListener(this._btnVipSupport, () => this.onBtnVipSupport());
        this.addTouchEventListener(this._btnWeekCard, () => this.onBtnWeekCard());
        this.addTouchEventListener(this._btnGiftBag, () => this.onBtnGiftBag());
        this.addTouchEventListener(this._btnLegion, () => this.onBtnLegion());
        this.addTouchEventListener(this._btnLock, () => this.onBtnLock());
    }




    ////////////////按钮回调////////////////////////////
    //切换主城 世界
    onBtnScene(event){
        logger.info("onBtnScene");
        if (this._isInMainScene){
            this.getAction().showOtherHandler({moduleName : "MapModule"});
            this._isInMainScene = false;
        }
        else{
            this.getAction().hideOtherHandler({moduleName: "MapModule"});
            this._isInMainScene = true;
        }


    }
    //战役
    onBtnZhanYi(event){
        logger.info("onBtnZhanYi")
        //this.getAction().showOtherHandler({moduleName : GameModule.RegionModule})
        this.getAction().showOtherHandler({moduleName : GameModule.BattleModule})
    }
    //武将
    onBtnWujiang(event){
        logger.info("onBtnWujiang")
        this.getAction().showOtherHandler({moduleName : GameModule.HeroModule})
    }
    //队伍
    onBtnTeam(event){
        logger.info("onBtnTeam")
        this.getAction().showOtherHandler({moduleName : GameModule.TeamModule})
        
    }
    //任务
    onBtnTask(event){
        logger.info("onBtnTask")
        this.getAction().showOtherHandler({moduleName : GameModule.TaskModule})
    }
    //背包
    onBtnBag(event){
        logger.info("onBtnBag")
        this.getAction().showOtherHandler({moduleName : GameModule.BagModule})
    }
    //排行
    onBtnRange(event){
        logger.info("onBtnRange")
        this.getAction().showOtherHandler({moduleName : GameModule.SceneModule})
    }


    //////////////////////主线任务 支线任务/////////////////////////
    //主线
    onBtnFirstLine(event){
        logger.info("onBtnFirstLine")
    }
    //支线
    onBtnSecondLine(event){
        logger.info("onBtnSecondLine")
    }

    //////////////////////////队列 事件////////////////////////////
    onBtnQuickTask(event){
        logger.info("onBtnQuickTask")
    }
    onBtnQueue(event){
        logger.info("onBtnQueue")
    }

    //季节
    onBtnSeason(event){
        logger.info("onBtnSeason")
        this.getAction().showOtherHandler({moduleName : GameModule.SeasonsModule})
    }

    //聊天
    onBtnChat(event){
        logger.info("onBtnChat")
        this.getAction().showOtherHandler({moduleName : GameModule.ChatModule})
    }

    //增益
    onBtnZengYi(event){
        logger.info("onBtnZengYi")
        this.getAction().showOtherHandler({moduleName : GameModule.GainModule})
    }
    //邮件
    onBtnMail(event){
        logger.info("onBtnMail")
        this.getAction().showOtherHandler({moduleName : GameModule.MailModule})
    }
    //朋友
    onBtnFriend(event){
        logger.info("onBtnFriend")
        this.getAction().showOtherHandler({moduleName : GameModule.FriendModule})
    }
    //目标 // 军工玩法所模块
    onBtnTarget(event){
        logger.info("onBtnTarget")
        this.getAction().showOtherHandler({moduleName : GameModule.MapMilitaryModule})
    }

    //公告 显示 活动 周卡 酒馆 商城.....
    //公告
    onBtnNotice(event){
        logger.info("onBtnNotice")
    }
    //限时
    onBtnLimit(event){
        logger.info("onBtnLimit")
        this.getAction().showOtherHandler({moduleName : GameModule.ActivityCenterModule})
    }
    //活动
    onBtnActive(event){
        logger.info("onBtnActive")
        this.getAction().showOtherHandler({moduleName : GameModule.GameActivityModule})
    }
    //酒馆
    onBtnPub(event){
        logger.info("onBtnPub")
        this.getAction().showOtherHandler({moduleName : GameModule.PubModule})
    }
    //商店
    onBtnShop(event){
        logger.info("onBtnShop")
        this.getAction().showOtherHandler({moduleName : GameModule.ShopModule})
    }
    //vip特供
    onBtnVipSupport(event){
        logger.info("onBtnVipSupport")
        this.getAction().showOtherHandler({moduleName : GameModule.VipSupplyModule})
    }
    //周卡
    onBtnWeekCard(event){
        logger.info("onBtnWeekCard")
        this.getAction().showOtherHandler({moduleName : GameModule.GameActivityModule})
    }
    //热卖
    onBtnGiftBag(event){
        logger.info("onBtnGiftBag")
        this.getAction().showOtherHandler({moduleName : GameModule.GiftBagModule})
    }
    //同盟
    onBtnLegion(event){
        logger.info("onBtnLegion")
        this.getAction().showOtherHandler({moduleName : GameModule.LegionGiftModule})
    }
    //锁定
    onBtnLock(event){
        logger.info("onBtnLock")
        this._isShowBtn = !this._isShowBtn
        let names = [
            "btnNotice",
            "btnLimit",
            "btnActive",
            "btnPub",
            "btnShop",
            "btnVipSupport",
            "btnWeekCard",
            "btnGiftBag",
            "btnLegion",
        ]
        for(let i = 0; i < names.length; i++){
            let name = names[i]
            this["_"+name].active = this._isShowBtn
        }
    }

    ////////////////渲染相关////////////////////////////
    render() {

    }

    onChatBtn()
    {   logger.info("  点击了  聊天模块的按钮 ")
        this.getAction().showOtherHandler({moduleName:"ChatModule"})
    }

}

ToolbarPanel.NAME = "ToolbarPanel";
export default ToolbarPanel;