/**
 * Created by snow on 2016-12-30.
 */
class NumFactory {
    
    getNumByType(hurtType, value) {
        var self = this;
        var num = null;
        var str = Math.abs(value) + "";
        if (hurtType == HurtType.CritHurt) {
            num = self.getCritNum(hurtType)
        } else if (hurtType == HurtType.AddHpHurt) {
            num = self.getAddNum()
        } else if (hurtType == HurtType.DodgeHurt ) {
            num = self.getMissNum()
        }
        else if (hurtType == HurtType.RefrainHurt ) {
            num = self.getRefrainNum(hurtType)
        }
        else{
            num = self.getMinusNum()
        }

        if (num ) {
            if (hurtType == HurtType.RefrainHurt || hurtType == HurtType.Crit){
                //暴击、克制的数值
                var number = num.getChildByTag(hurtType)
                number.setString(value)
            } else if (hurtType != HurtType.DodgeHurt) {
                // 闪避没数值
                //num.setString(str)
            }
        }
        return num
    }

    getMissNum(){
        var sprite = new cc.Sprite();
        sprite.initWithSpriteFrameName("images/battle/image19.png");
        sprite.setString = function(){};
        return sprite;
    }

    getMinusNum(){
        var num = new ccui.TextAtlas()
        num.setProperty("1234567890", "res/ui/images/fonts/num_attack_2.png", 34, 46, "0")
        return num
    }

    getCritNum(hurtType) {
        var self = this;
        var node = new cc.Sprite()

        var num = new ccui.TextAtlas();
        num.setProperty("1234567890", "res/ui/images/fonts/num_attack_1.png", 34, 46, "0")

        node.addChild(num, 0, hurtType)

        var resTab = ["bg_eff", "bao_eff", "ji_eff"]
        for (var i = 0; i < resTab.length; i++){
            var url = G_Lan("images/battle/{0}.png", resTab[i])
            var eff = new cc.Sprite();
            eff.initWithSpriteFrameName(url);
            node.addChild(eff, 0, resTab[i])
        }
        node.resTab = resTab
        return node
    }

    getRefrainNum (hurtType) {
        var self = this;
        var node = new cc.Sprite()
        var num = self.getMinusNum()
        node.addChild(num, 0, hurtType)

        // var resPos = {-16.15, -8.56}   //旋转：背景、克制
        var resTab = ["bg_eff", "kz_eff"]
        for (var i = 0; i < resTab.length; i++){
            var url = G_Lan("images/battle/{0}.png", resTab[i])
            var eff = new cc.Sprite();
            eff.initWithSpriteFrameName(url);
            node.addChild(eff, 0, resTab[i])
        }
        node.resTab = resTab
        return node
    }

    getAddNum(){
        var num = new ccui.TextAtlas()
        num.setProperty("1234567890", "res/ui/images/fonts/num_attack_3.png", 38, 39, "0")
        return num
    }
}

NumFactory._instance = null;
NumFactory.getInstance = function(){
    if(!NumFactory._instance){
        NumFactory._instance = new NumFactory();
    }
    return NumFactory._instance;
}

export default NumFactory;