//module("battleCore", package.seeall)
import { ModelAnimation, ModelDirection, ModelConsIndex, BattleCamp, HurtType, HurtEffectType, HurtSkillConf } from "BattleConst";
import ConfigDataManager from "ConfigDataManager";
import ConfigName from "ConfigName";
import BasicComponent from "BasicComponent";
import TextWords from "TextWords";

class Puppet extends BasicComponent{

    setBackgroupLayer() {

    }

    setBattleHandle(battle) {
        this._battle = battle
    }

    setBattlePanel(battlePanel) {
        this._battlePanel = battlePanel
    }

    constructor(attr, rootNode) {
        super(attr, rootNode)

        this._infoPanel = rootNode.getChildByName("infoPanel")
        this._bloodPanel = rootNode.getChildByName("bloodPanel")

        rootNode.active = true
        rootNode.puppet = this

        let index = attr.index
        let modelType = attr.modelList


        if (index == ModelConsIndex.Left || index == ModelConsIndex.Right) {
            modelType = 1001  //军师出战，军师模型暂缺，写死用1001模型
        }

        // //modelType 需要判断这个包里面有没有资源，如果没有，直接转换成低阶兵逻辑，从根源处理
        // let json = "model/" + modelType + "/skeleton.json"
        // let jsonF = cc.FileUtils.getInstance().isFileExist(json)
        // if (jsonF != true) {  //文件不存在了，直接转换成低阶兵
        //     modelType = math.floor(modelType / 100) * 100 + 5
        //     this._reliefModelType = modelType
        // }

        this._index = index          //坑位
        this._heroId = attr.heroId   //武将id/军师id
        this._consiStar = attr.star  //军师星级

        if (index < 20) {
            this.camp = BattleCamp.Left
        } else {
            this.camp = BattleCamp.Right
        }

        attr.camp = this.camp

        this._rootNode = rootNode

        let x, y = this._rootNode.getPosition()
        this._spawPos = cc.p(x, y)

        this._defaultScale = 1 //attr.scale || 1
        this._curZhenfa = this._defaultZhenfa
        let info = ConfigDataManager.getMatchData(ConfigName.ModelGroConfig, { modelID: modelType })
        this._defaultModelNum = info.num
        this._defaultDir = this.getDefaultDir(index, info.dir)
        this._curDir = this._defaultDir
        this._defaultZhenfa = info.formationID

        this._curHp = attr.hp
        this._maxHp = attr.hp
        this._modelType = modelType
        this._name = attr.name
        this._birthBuffs = attr.buffs

        let txtHp = this._infoPanel.getChildByName("txtHp")
        txtHp.active = true //初始化显示hp

        if (this._infoPanel != null) {
            this._infoPanel.active = true
            this.setHpTxt(this._curHp, attr.num)
            this.setModelName()
        }


        this._liveModelNum = this._defaultModelNum

        this._deathMap = {}  //把死亡的阵眼丢进这个Map来

        this.createAllModel(modelType)

        this._ccbMap = {}
    }



    //获取替身模型，如果不为nil的话，需要在技能回合时，强转一下技能ID
    getReliefModelType() {
        return this._reliefModelType
    }


    finalize() {
        this._rootNode.puppet = null
        this._rootNode.stopAllActions()
        for (let key in this._modelMap) {
            this._modelMap[key].finalize()
        }

        for (let key in this._ccbMap) {
            this._ccbMap[key].finalize()
        }
        this._ccbMap = {}

        this._rootNode = null
        this._infoPanel = null
        this._bloodPanel = null
        this._battlePanel = null
    }

    stopAllActions() {
        this._rootNode.stopAllActions()
    }

    getDefaultZhenfa() {
        return this._defaultZhenfa
    }

    createAllModel(id) {

        let modelMap = {}

        for (let eye = 1; i <= this._defaultModelNum; ++eye) {

            let info = this.getZhenfaInfo(this._defaultZhenfa, eye)

            let x = this.xAxis(info.x)
            let y = info.y
            let model = this.createModel(id)
            model.setPosition(x, y)
            modelMap[info.eye] = model

            model.setletZOrder(100 - y)
            let scale = this.getScaleByY(y)
            model.setScale(scale)
            // logger.info("puppet 初始 缩放 scale=%.2f",scale)     

            //播放出生特效   
        }

        this._modelMap = modelMap

    }

    playBirthAction() {
        for (let key in this._modelMap) {
            this._modelMap[key].setOpacity(0)
        }
        let action = cc.fadeTo(1, 255)
        this.runModelAction(action)
    }

    //主要是右边的出场移动
    birthMove(complete) {
        // let dir = this._defaultDir
        let dir = this.getDirFromExchangeCamp()  //根据阵营转为朝向
        let srcPos = this._rootNode.srcPos
        this._rootNode.setPosition(srcPos.x + 300 * dir, srcPos.y)
        let moveAction = cc.moveTo(1, cc.p(srcPos.x, srcPos.y))

        let callback = (function () {
            this.playAnimation(ModelAnimation.Wait, true)
            if (complete != null) {
                let x, y = this._rootNode.getPosition()
                //            logger.info("~~~~~uppet.birthMove~~index.%d~~~srcPos.x.%f, srcPos.y.%f~~~~x.%f,y.%f~",
                //                this._index, srcPos.x, srcPos.y, x, y)
                complete()
            }
        }).bind(this)
        this.playAnimation(ModelAnimation.Run, true)
        let action = cc.sequence(moveAction, cc.callFunc(callback))
        this._rootNode.runAction(action)
    }

    //播放出生Buff特效
    //返回是否有播放
    playBirthBuffEffect() {

        let index = 0
        let isPlay = false
        for (let key in this._birthBuffs) {
            let buff = this._birthBuffs[key];
            let buffId = buff.id
            let info = ConfigDataManager.get(ConfigName.BuffConfig, buffId)
            if (info != null && info.showID > 0) {
                //添加特效
                let playBuffEffect = function (self, showID) {
                    self.playBuffEffect(showID)
                }

                if (index == 0) {
                    this.playBuffEffect(info.showID)
                } else {
                    this.addTimerOnce(1000, playBuffEffect, this, info.showID)
                }
                index = index + 1
                //            
                isPlay = true
            }
        }

        if (isPlay == true) {
            //        AudioManager.playEffect("battle_chuchang", "wav")
            this.playAnimation(ModelAnimation.Win, true)
        }
    }

    playBuffEffect(id) {
        let sprite = TextureManager.createSprite("images/buffIcon/" + id + ".png")
        sprite.setPosition(50, 50)
        this.addChild(sprite)
        sprite.setletZOrder(100)

        let callback = function () {
            sprite.removeFromParent()
        }
        let delay = math.random(0, 500)
        BirthBuffEffect.play(sprite, delay / 1000, callback)
    }


    updateBuffCCBList(buffList) {
        for (let key in buffList) {
            let v = buffList[key]
            if (v.lastRound > 0) {
                this.addBuffCCB(v.id)
            } else {
                this.delBuffCCB(v.id)
            }
        }
    }

    // 添加buff特效
    addBuffCCB(buffId) {
        let buffCfgData = ConfigDataManager.get(ConfigName.BuffConfig, buffId)
        if (buffCfgData == null || buffCfgData.ccb == " ") {
            return
        }
        if (this._ccbMap[buffCfgData.ccb] == null) {
            let pos = JSON.parse(buffCfgData.warDeviation)

            let ArmyCfgData = ConfigDataManager.get(ConfigName.ArmKindsConfig, this._modelType)
            let x = 0
            let y = 0
            if (ArmyCfgData != null) {
                let scale = StringUtils.jsonDecode(ArmyCfgData.multiple)

                x = scale[1] / 10000 * (pos[1] || 0)
                y = scale[2] / 10000 * (pos[2] || 0)
            }


            if (this.camp == BattleCamp.Right) {
                x = - x
            }

            x = x + this._rootNode.getContentSize().width / 2

            let ccb = UICCBLayer.new(buffCfgData.ccb, this._rootNode)
            ccb.setPosition(x, y)
            ccb.setletZOrder(100)
            this._ccbMap[buffCfgData.ccb] = ccb
        }
    }

    // 移除buff特效
    delBuffCCB(buffId) {
        let buffCfgData = ConfigDataManager.get(ConfigName.BuffConfig, buffId)
        if (buffCfgData == null || buffCfgData.ccb == " ") {
            return
        }
        if (this._ccbMap[buffCfgData.ccb] == null) {
            return
        }
        this._ccbMap[buffCfgData.ccb].finalize()
        this._ccbMap[buffCfgData.ccb] = null
    }

    //创建佣兵模型/军师模型
    createModel(id) {

        let model = SpineModel.new(id, this._rootNode, true)
        model.playAnimation(ModelAnimation.Wait, true)
        model.setDirection(this._defaultDir)

        return model
    }

    getDefaultDir(index, configDir) {
        // 模型出生朝向
        let dir = ModelDirection.Left
        if (this.camp == BattleCamp.Left) {
            dir = ModelDirection.Right
        }

        if (configDir) {
            dir = dir * configDir //
        }

        return dir
    }

    playAnimation(animation, isLoop, completeCallback, customEventKey, ccustomCallback) {

        let curEndNum = 0
        let maxEndNum = 0
        let endCallback = function (model) {
            curEndNum = curEndNum + 1
            if (curEndNum >= maxEndNum) {
                if (completeCallback != null) {
                    completeCallback()
                }
                //需要把回调的注册删除掉
            }
            model.removeEventLister("complete", animation, endCallback)
        }

        let cusCurEndNum = 0
        let customCallback = function (model) {
            cusCurEndNum = cusCurEndNum + 1
            if (cusCurEndNum >= maxEndNum) {
                if (ccustomCallback != null) {
                    ccustomCallback()
                }
                //需要把回调的注册删除掉
            }
            model.removeEventLister(customEventKey, animation, customCallback)
        }

        for (let key in this._modelMap) {
            let model = this._modelMap[key]
            let delayPlayAnimation = function (that, model, animation, isLoop) {
                if (isLoop != false) { //循环播放的不回调
                    endCallback = null
                }
                model.playAnimation(animation, isLoop, endCallback, model, customEventKey, customCallback)
            }
            //待机的 直接切换  不然在切换过程中又进行再切换 则会出现问题
            //TODO 这里有可能会引发BUG！！！ //animation == ModelAnimation.Wait or
            if (model.isDeath != true && (true || animation == ModelAnimation.Run
                || animation == ModelAnimation.Wait || animation == ModelAnimation.Attack)) {
                maxEndNum = maxEndNum + 1
                model.playAnimation(animation, isLoop, endCallback, model, customEventKey, customCallback)
            }
            else if (model.isDeath != true) {
                maxEndNum = maxEndNum + 1
                let time = math.ceil(1000 / GameConfig.frameRate) * math.random(2, 16)
                this.addTimerOnce(time, delayPlayAnimation, this, model, animation, isLoop)
            }
        }
    }

    setDirection(dir) {
        if (this._curDir == dir) {
            return
        }
        this._curDir = dir
        for (let key in this._modelMap) {
            this._modelMap[key].setDirection(dir)
        }
    }

    getDirection() {
        return this._curDir
    }

    setPosition(x, y) {
        this._rootNode.setPosition(x, y)
    }

    getPosition() {
        return this._rootNode.getPosition()
    }

    getCenterPosition() {
        let x, y = this.getPosition()
        return x + 50, y + 80
    }

    setScale(scale) {
        for (let key in this._modelMap) {
            this._modelMap[key].setScale(scale)
            // logger.info("puppet 缩放 scale=%.2f",scale)
        }
    }

    setActive(visible) {
        this._rootNode.active = visible
    }

    //受击效果
    beHurt(bloods, num, callback, fCount, fsecond, delayDeath, delayHurt) {

        this._isBeHurt = true //状态判断

        //算出要死的阵眼
        for (let key in bloods) {
            this.cutHp(blood.delta, num, blood.state, fCount, fsecond)
        }

        //////////////处理死亡的逻辑////////////////
        if (callback == null) {
            this._isBeHurt = false
            if (this._liveModelNum == 0) {
                this.hideInfoPanel()
            }
            return
        }

        let rate = this._curHp / this._maxHp

        let newDeathEyeList = {}
        for (let eye = 1; eye <= this._defaultModelNum; ++eye) {
            if ((eye - 1) / this._defaultModelNum >= rate) {
                //eye死亡
                if (this._deathMap[eye] == null) {
                    table.insert(newDeathEyeList, eye)
                    this._deathMap[eye] = true
                }
            }
        }

        let endCall = (function () {
            //        logger.info("=========endCall===============")
            this._isBeHurt = false
            this.playAnimation(ModelAnimation.Wait, true)
            if (this._curHp <= 0) {
            } else {
                this._infoPanel.active = true  //TODO 这里有可能都死光了，不用再显示出来
            }

            if (callback != null) {
                callback()
            }
        }).bind(this)

        let beDeathCallback = (function () {
            if (this._liveModelNum == 0) { //全死光了
                if (callback != null) { //死光的时候是没有behurt回调的
                    logger.info("=========beDeathCallback===============" + this._index)
                    callback()
                }
                this.hideInfoPanel() //
            }
        }).bind(this)

        let delayDeathEye = (function () {
            //死亡的，直接播放
            for (let key in newDeathEyeList) {
                let eye = newDeathEyeList[key]
                this.beDeath(eye, beDeathCallback)
            }
        }).bind(this)

        if (this._curHp > 0) {
            delayDeathEye()  //还活着，该死的还是直接死
        } else {
            delayDeath = delayDeath || 0.2
            this.addTimerOnce(delayDeath * 1000, delayDeathEye, self)
        }

        //////////////////////////////////////-

        //TODO 受击时，处理其血量，并且处理相关死亡逻辑
        //会同时做一些击退逻辑

        let behurtcallback = function () {
            logger.info("////////////behurtcallback//////////////")
        }

        let delayhurt = (function () {
            this.playAnimation(ModelAnimation.Hurt, false, endCall)
            this.characterColor(255, 0, 0)
        }).bind(this)

        if (this._liveModelNum == 0) {

        } else if (this._curHp > 0) { //没死光，受击效果
            this._infoPanel.active = false
            delayHurt = delayHurt || 0.3
            this.addTimerOnce(delayHurt * 1000, delayhurt, self)
        }

    }

    //某个阵眼死掉了
    //通过计算整体的血量比,来决定死亡数
    beDeath(eye, callback) {
        let model = this.getModel(eye)

        let endCall = (function () {
            this._liveModelNum = this._liveModelNum - 1
            model.active = false
            callback()
        }).bind(this)

        model.playAnimation(ModelAnimation.Die, false, endCall)

        model.isDeath = true // 标记已经死了
    }

    characterColor(r, g, b) {
        let action1 = cc.tintTo(0.2, r, g, b)
        let action2 = cc.tintTo(0.2, 255, 255, 255)
        let action = cc.sequence(action1, action2)

        this.runModelAction(action)
    }

    backgroundColorAction(r, g, b, a, time) {
        time = time || 1
        let action1 = cc.tintTo(time, r, g, b)
        let atioin1_1 = cc.fadeTo(time, a)

        let action2 = cc.tintTo(time, 255, 255, 255)
        let action2_2 = cc.fadeTo(time, 255)


        let action = cc.sequence(cc.spawn(action1, atioin1_1), cc.spawn(action2, action2_2))

        let panelRoot = this._battlePanel.getPanelRoot()
        panelRoot.runAction(action)
    }

    //血量变化
    cutHp(delta, num, hurtType, fCount, frameList) {
        let curHp = this._curHp - delta

        if (curHp < 0) {
            curHp = 0
            delta = this._curHp
        }
        let campHpDelta = delta

        if (curHp >= this._maxHp) {  //加到满血
            curHp = this._maxHp
            campHpDelta = this._curHp - this._maxHp
        }

        if (hurtType == HurtType.CritHurt) {
            this._battle.playShark()
        }

        this._curHp = curHp

        this.setHpTxt(this._curHp, num)

        // logger.info("!!!!!!Puppet.cutHp!!!!!!!!campHpDelta.%d!!!!index.%d!!!!curHp.%d!!!!delta.%d!!!!%s", 
        //     campHpDelta, this._index, curHp, delta, debug.traceback())

        this._battlePanel.cutHpByCamp(campHpDelta, this.getCamp())

        fCount = fCount || 1  //飘血的次数
        //    fsecond = fsecond || 1.2  //持续秒数

        let lastFrame = 0
        let curCount = 0
        let effectCallback = (function () {
            if (curCount <= fCount) {

                let curDelta = math.floor(delta / fCount * curCount)
                if (curCount == fCount) {
                    curDelta = delta
                }

                curCount = curCount + 1
                let fsecond = GameConfig.frequency * 30
                if (frameList[curCount] != null) {
                    fsecond = GameConfig.frequency * (frameList[curCount] - lastFrame)
                    lastFrame = frameList[curCount]
                }

                // print("持续秒数···fsecond, fCount, curCount", fsecond, fCount, curCount)

                this.playBloodEffect(curDelta, hurtType, fsecond, curCount, fCount)

                this.addTimerOnce(fsecond * 1000, effectCallback, self)
            } else {

            }
        }).bind(this)

        //TODO 这里做单独的飘血逻辑frequency
        curCount = curCount + 1
        let fsecond = GameConfig.frequency * frameList[curCount]
        lastFrame = frameList[curCount]
        this.addTimerOnce(fsecond * 1000, effectCallback, self)
    }

    //渲染当前 血量 人数
    setHpTxt(hp, num) {
        
        let txtHp = this._infoPanel.getChildByName("txtHp")        
        this.setLabel(txtHp, num)
        return;
        let hpBar = this._infoPanel.getChildByName("hpBar")
        let percent = hp / this._maxHp * 100
        this.setPercent(hpBar, percent)
        hpBar.active = false
    }

    setModelName() {
        let txtName = this._infoPanel.getChildByName("txtName")
        let info = ConfigDataManager.get(ConfigName.ModelGroConfig, this._modelType)
        this.setLabel(txtName, info.modelName)

        //同时设置武将
        let heroId = this._heroId
        let imgHeroBg = this._infoPanel.getChildByName("imgHeroBg")

        // print("//同时设置武将名字 heroId,index",heroId,this._index)

        if (heroId > 0) {
            imgHeroBg.active = true

            let initVisible = false
            let power = GamePowerConfig.Hero
            if (this._index == ModelConsIndex.Left || this._index == ModelConsIndex.Right) {
                power = GamePowerConfig.Counsellor  //军师名字
                initVisible = true
            }

            let info = ConfigDataManager.getConfigByPowerAndID(power, heroId)
            let color = ColorUtils.getColorByQuality(info.color)
            //txtName.setColor(color)
            this.setLabel(txtName, info.name)

            if (initVisible == true) {
                this.setConsiNameVisible(initVisible) //初始化，默认显示军师名字
            } else {
                TextureManager.updateImageView(imgHeroBg, info.url)
                imgHeroBg.setScale(0.3)
                this.setHeroNameVisible(initVisible) //初始化，默认不显示英雄名字
            }

        } else {
            imgHeroBg.active = false
            txtName.active = false

            //txtName.setColor(ColorUtils.wordWhiteColor)

            this.setLabel(txtName, TextWords[127])
        }
    }

    //设置军师名字的显示
    setConsiNameVisible(visible) {
        let bgImg = this._infoPanel.getChildByName("imageNameBg")
        let imgHeroBg = this._infoPanel.getChildByName("imgHeroBg")
        let txtName = this._infoPanel.getChildByName("txtName")
        let txtStar = this._infoPanel.getChildByName("txtStar")
        let txtHp = this._infoPanel.getChildByName("txtHp")
        txtHp.setVisible(!visible)
        txtName.setVisible(visible)

        let star = this._consiStar  //军师的星级，为0时不显示星级
        if (star == null || star > 5) {  //star > 5 暂时先按0处理
            star = 0
        }

        let x = bgImg.getPositionX()
        if (star == 0) {  //没星时名字居中
            imgHeroBg.active = false
            txtStar.active = false
            bgImg.setScaleX(1)
            let size = bgImg.getContentSize()
            let scalex = bgImg.getScaleX()
            txtName.setPositionX(x + size.width * scalex / 2 + 5)
            txtName.setAnchorPoint(0.5, 0.5)
        } else {  //有星时名字跟随星级
            //let url = string.format("images/newGui1/adviser_num_%d.png", star)
            
            
            this.setLabel(txtStar. star)
            txtStar.setletZOrder(25)
            TextureManager.updateImageView(imgHeroBg, "images/newGui1/IconStarMini.png")
            imgHeroBg.setScale(1)
            imgHeroBg.setletZOrder(20)
            bgImg.setScaleX(1.5)

            let size1 = imgHeroBg.getContentSize()
            let size2 = txtStar.getContentSize()

            let par = txtName.getParent().getParent()
            print("//////////////////////////////par//////////////////" + par.getPositionX())
            if (par.getPositionX() > 320) {
                txtName.setPositionX(x + size1.width + size2.width - 10)
            } else {
                txtName.setPositionX(x + size1.width + size2.width + 10)
            }
            txtName.setAnchorPoint(0, 0.5)
            imgHeroBg.active = true
            txtStar.active = true
        }

    }

    //设置英雄名字的可见性
    setHeroNameVisible(visible) {
        let txtName = this._infoPanel.getChildByName("txtName")
        txtName.setVisible(visible)

        let txtHp = this._infoPanel.getChildByName("txtHp")
        txtHp.setVisible(!visible)
    }

    getModelType() {
        return this._modelType
    }

    getModelName() {
        return this._modelName
    }

    getName() {
        return this._name
    }

    getCamp() {
        return this.camp
    }

    // 根据阵营转为朝向,左边阵营朝右，右边阵营朝左
    getDirFromExchangeCamp() {
        let dir = ModelDirection.Left
        if (this.camp == BattleCamp.Left) {
            dir = ModelDirection.Right
        }
        return dir
    }

    hideInfoPanel() {
        if (this._rootNode == null) {
            logger.info("~~~~~~~~~~Puppet.hideInfoPanel~~~~~~~index.%d~~~~~~~~~~~~~", this._index)
        }
        this._infoPanel.active = false
        this._rootNode.active = false
    }

    playBloodEffect(delta, hurtType, actionTime, curCount, fCount) {

        // hurtType = HurtType.RefrainHurt  //TODO 测试代码 克制
        // hurtType = HurtType.CritHurt  //TODO 测试代码 暴击

        let value = math.abs(delta)
        let boolItem = self["_boolItem" + hurtType]
        if (boolItem == null) {
            boolItem = NumFactory.getInstance().getNumByType(hurtType, value)
            boolItem.setPosition(50, 50)
            boolItem.setletZOrder(4000)

            if (this._bloodPanel) {
                this._bloodPanel.addChild(boolItem)
            } else {
                this._rootNode.addChild(boolItem)  //容错
            }


            self["_boolItem" + hurtType] = boolItem
        }

        if (hurtType == HurtType.RefrainHurt || hurtType == HurtType.CritHurt) {
            //暴击、克制的数值
            let number = boolItem.getChildByTag(hurtType)

            this.setLabel(number, value)
        } else {
            this.setLabel(boolItem, value)
        }

        boolItem.stopAllActions()
        boolItem.active = true

        let callback = function () {
            boolItem.active = false
        }

        let args = {}
        args["x"] = 50
        args["y"] = 50
        args["value"] = delta
        args["hurtType"] = hurtType
        args["actionTime"] = actionTime //持续时间
        args["parent"] = this._rootNode
        args["callback"] = callback
        args["effectNode"] = boolItem
        args["curCount"] = curCount
        args["fCount"] = fCount

        BloodEffect.play(args)
    }

    //外部整体移动
    //speed单位， 像素/s
    moveTo(pos, speed, callback) {

        let [tx, ty] = [pos.x, pos.y]
        let [sx, sy] = [this._rootNode.getPosition().x, this._rootNode.getPosition().y]

        let dx = tx - sx
        if (dx != 0) {
            let dir = this.getDirByDx(dx)
            this.setDirection(dir)
        }

        let ady = math.abs(ty - sy)
        let adx = math.abs(dx)
        let s = math.sqrt(ady * ady + adx * adx)

        let time = s / speed

        let moveEnd = (function () {
            this.playAnimation(ModelAnimation.Wait, true)
            this.setDirection(this._defaultDir)
            if (callback != null) {
                callback()
            }
        }).bind(this)

        let move = cc.moveTo(time, pos)
        let action = cc.sequence(move, cc.callFunc(moveEnd))

        this._rootNode.runAction(action)

        this.playAnimation(ModelAnimation.Run, true)
    }

    getSpawPos() {
        return this._spawPos
    }

    //阵法改变。内部模型改变 time变阵时间，单位毫秒
    changeZhenfa(zhenfaId, time, callback) {

        if (this._curZhenfa == zhenfaId) {
            if (callback != null) {
                callback()
            }
            return
        }
        this._curZhenfa = zhenfaId

        let num = 0
        let completeCall = (function (target) {
            this.chageModelletZOrder(target.eye)
            num = num + 1
            if (num == this._defaultModelNum) {
                if (callback != null) {
                    callback()
                }
            }
        }).bind(this)

        logger.info("=====changeZhenfa==zhenfaId.%d=====modelType.%d==========", zhenfaId, this._modelType)

        for (let eye = 1; eye <= this._defaultModelNum; ++eye) {
            let info = this.getZhenfaInfo(zhenfaId, eye)
            if (info == null) {
                info = this.getZhenfaInfo(this._defaultZhenfa, eye)
            }

            let x = this.xAxis(info.x)
            let y = info.y

            let model = this.getModel(eye)

            let moveTo = cc.moveTo(time / 1000, cc.p(x, y))

            let dir = model.getDirection()
            let scale = this.getScaleByY(y)
            let scaleTo = cc.scaleTo(time / 1000, dir * scale, scale)

            let spawn = cc.spawn(moveTo, scaleTo)

            let action = cc.sequence(spawn, cc.callFunc(completeCall))

            model.runAction(action)
            model._rootNode.eye = eye //直接赋值 缓存了。。
        }

    }

    getZhenfaInfo(zhenfa, eye) {
        let info = ConfigDataManager.getMatchData(ConfigName.ZhenfaConfig, { type: zhenfa, eye: eye, camp: this.camp })
        return info
    }

    xAxis(x) {
        if (this.camp == BattleCamp.Left) {
            //        x = 100 + x
        }

        return x
    }

    //通过Y值 获取对应的scale比例
    //0->1  100->0.6
    getScaleByY(y) {
        return 1
        //    return this._defaultScale - y * 0.0025
    }

    chageModelletZOrder(eye) {
        let model = this.getModel(eye)
        let _, y = model.getPosition()
        model.setletZOrder(100 - y)
    }

    chageModelScale(eye) {
        let model = this.getModel(eye)
        let _, y = model.getPosition()
        let scale = this.getScaleByY(y)
        model.setScale(scale)
    }

    getModel(eye) {
        return this._modelMap[eye]
    }

    runModelAction(action) {
        for (let key in this._modelMap) {
            let ac = action.clone()
            this._modelMap[key].runModelAction(ac)
        }
    }

    getDirByDx(dx) {
        let dir = ModelDirection.Right
        if (dx < 0) {
            dir = ModelDirection.Left
        }
        return dir
    }

    getMapPanel() {
        if (this._rootNode == null) {
            return
        }
        return this._rootNode.getParent()
    }

    addChild(child) {
        if (this._rootNode == null) {
            return
        }
        this._rootNode.addChild(child)
    }

    addTimerOnce(delay, func, obj, args) {
        this._battle.addTimerOnce(delay, func, obj, args)
    }

    playEffect(effectName, dx, dy, delay) {
        if (this._rootNode == null) {
            return
        }
        let createEffect = (function () {
            let spineEffect = SpineEffect.new(effectName, this._rootNode)
            spineEffect.setPosition(dx * this._curDir + 50, dy + 50)  //50写死。居中处理。 * this._curDir
            spineEffect.setletZorder(1000)
            spineEffect.setDirection(this._curDir)
            logger.info("低阶特效 Puppet effectName,dx,dy,delay,dir=%s,%d,%d,%d,%d", effectName, dx, dy, delay, this._curDir)
        }).bind(this)

        if (delay > 0) {
            // TimerManager.addOnce(delay, this.delayNextAction, self)
            this.addTimerOnce(delay, this.delayNextAction, self)
        } else {
            createEffect()
        }

    }


}

export default Puppet;

