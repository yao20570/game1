/**
 * Created by on 2017/9/25.
 */
import BasicPanel from "BasicPanel";
import logger from "Logger";
import ConfigName from "ConfigName";
import ConfigDataManager from "ConfigDataManager";


let SEX = {
    MAN:1,
    WOMAN:2,
}

class CreateRolePanel extends BasicPanel{

    initPanel(){

        this._sex = SEX.MAN //默认男

        this._editRoleName = this.getChildByName("editRoleName");
        this._btnEnterGame = this.getChildByName("btnEnterGame");
        this._btnDice = this.getChildByName("btnDice");
        this._btnRole1 = this.getChildByName("btnRole1");
        this._btnRole2 = this.getChildByName("btnRole2");
        this._setSelect(SEX.MAN)
    }


    registerEvents(){
        this.addTouchEventListener(this._btnDice, () => this.onTouchBtnDice());
        this.addTouchEventListener(this._btnRole1, () => this.onTouchBtnRole1());
        this.addTouchEventListener(this._btnRole2, () => this.onTouchBtnRole2());
        this.addTouchEventListener(this._btnEnterGame, () => this.onTouchBtnEnterGame());

        //测试按钮
        this._testBtn = this.getChildByName("testBtn");
        this.addTouchEventListener(this._testBtn, () => this.onTestBtn());
    }

    onTestBtn(){
        logger.info("打开世界模块");
        this.getAction().showOtherHandler({moduleName : "MapModule"})
    }


    /**
     * 方法说明 点击骰子按钮回调
     * @method onTouchBtnDice
     * @param event
     * @return null
     */
    onTouchBtnDice(event){
        logger.info("点击骰子")

        let name = this._getRandomFullName(this._sex)
        this._editRoleName.getComponent(cc.EditBox).string = name

    }


    /**
     * 方法说明 点击角色1按钮回调
     * @method onTouchBtnRole1
     * @param event
     * @return null
     */
    onTouchBtnRole1(event){
        if(this._sex == SEX.MAN){
            return
        }
        logger.info("点击role1")
        this._sex = SEX.MAN
        this._setSelect(SEX.MAN)
    }


    /**
     * 方法说明 点击角色2按钮回调
     * @method onTouchBtnRole2
     * @param event
     * @return null
     */
    onTouchBtnRole2(event){
        if(this._sex == SEX.WOMAN){
            return
        }
        logger.info("点击role2")

        this._sex = SEX.WOMAN

        this._setSelect(SEX.WOMAN)

    }


    _setSelect(sex){
        if(sex == SEX.MAN){
            this._btnRole1.getChildByName("imageHead").active = false
            this._btnRole2.getChildByName("imageHead").active = true
            this._btnRole1.getChildByName("spine").active = true
            this._btnRole2.getChildByName("spine").active = false

            let self = this
            
            var realUrl = cc.url.raw("resources/images/createRole/Btn_Frame_down.png");
            cc.loader.load(realUrl, function (error, texture) {
                if (error) {
                    cc.log("!!!!!!!!!!!!!error = " + error);
                    return;
                }
                let frame = new cc.SpriteFrame(texture);
                self._btnRole1.getComponent(cc.Sprite).spriteFrame = frame;
            });
    
            var realUrl = cc.url.raw("resources/images/createRole/Btn_Frame_none.png");
            cc.loader.load(realUrl, function (error, texture) {
                if (error) {
                    cc.log("!!!!!!!!!!!!!error = " + error);
                    return;
                }
                let frame = new cc.SpriteFrame(texture);
                self._btnRole2.getComponent(cc.Sprite).spriteFrame = frame;
            });
        }else{

            this._btnRole1.getChildByName("imageHead").active = true
            this._btnRole2.getChildByName("imageHead").active = false
            this._btnRole1.getChildByName("spine").active = false
            this._btnRole2.getChildByName("spine").active = true
    
            let self = this
    
            var realUrl = cc.url.raw("resources/images/createRole/Btn_Frame_none.png");
            cc.loader.load(realUrl, function (error, texture) {
                if (error) {
                    cc.log("!!!!!!!!!!!!!error = " + error);
                    return;
                }
                let frame = new cc.SpriteFrame(texture);
                self._btnRole1.getComponent(cc.Sprite).spriteFrame = frame;
            });
    
            var realUrl = cc.url.raw("resources/images/createRole/Btn_Frame_down.png");
            cc.loader.load(realUrl, function (error, texture) {
                if (error) {
                    cc.log("!!!!!!!!!!!!!error = " + error);
                    return;
                }
                let frame = new cc.SpriteFrame(texture);
                self._btnRole2.getComponent(cc.Sprite).spriteFrame = frame;
            });
        }
    }

    /**
     * 方法说明 点击进入游戏
     * @method onTouchBtnRole2
     * @param event
     * @return null
     */
    onTouchBtnEnterGame(event){
        logger.info("点击onTouchBtnEnterGame")

        let data = {}
        data.sex = this._sex
        data.name = this._editRoleName.getComponent(cc.EditBox).string
        
        if(data.name == ""){
            this.showMessage("showSysMessage 204")
            return
        }

        logger.info("检测名字是否合法 todo")
        logger.info("检测名字的长度是否合法 todo")


        // if not StringUtils:checkStringValid(data.name) then
        //     self:showSysMessage(self:getTextWord(205))
        //     return
        // end
        // if not StringUtils:checkStringSize(data.name) then
        //     self:showSysMessage(self:getTextWord(219))
        //     return
        // end

        // -- 设置不能点击(点击了创角后，再点击名称输入会弹出输入框(android), 并且关不掉)
        // local inputPanel = self:getChildByName("mainPanel/inputPanel")
        // inputPanel:setTouchEnabled(false)
        // this._editRoleName.getComponent(cc.EditBox).active = false
    
        // -- 1秒后启用点击(防止当创角失败后无法点击输入名称)
        // local d1 = cc.DelayTime:create(1)
        // local cf1 = cc.CallFunc:create(function() inputPanel:setTouchEnabled(true) end)
        // local seq = cc.Sequence:create(d1, cf1)
        // inputPanel:stopAllActions()
        // inputPanel:runAction(seq)

        this.getAction().createRole(data);
    }

    /**
     * 方法说明 获得随机名字
     * @method _getRandomFullName
     * @param sex 性别
     * @return 随机名字
     */
    _getRandomFullName(sex){
        //姓随机数
        let ConfigLen = ConfigDataManager.getConfigLength(ConfigName.FamilyNameConfig)
        let randNum1 = Math.floor(Math.random() * ConfigLen)+1
        //名随机数
        ConfigLen = ConfigDataManager.getConfigLength(ConfigName.GivenNameConfig)
        let randNum2 = Math.floor(Math.random() * ConfigLen)+1

        //获取姓
        let name1c = ConfigDataManager.get(ConfigName.FamilyNameConfig, randNum1);
        let name1 = name1c.Fname

        //获取名
        let name2c = ConfigDataManager.get(ConfigName.GivenNameConfig, randNum2);

        let name2
        if(sex == SEX.MAN){
            name2 = name2c["Mname"]
        }else{
            name2 = name2c["Wname"]
        }

        let randName = name1 + name2
        logger.info("====获取随机名字==%s=======", randName)
        return randName
    }

    ////////////////渲染相关////////////////////////////
    render(){

    }

}

CreateRolePanel.NAME = "CreateRolePanel";
export default CreateRolePanel;