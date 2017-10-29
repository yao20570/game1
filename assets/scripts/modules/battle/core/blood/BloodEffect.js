/**
 * Created by snow on 2016-12-30.
 */

import BloodMinusEffect from "BloodMinusEffect";
import BloodRateEffect from "BloodRateEffect";
import BloodCritEffect from "BloodCritEffect";
import BloodRefrainEffect from "BloodRefrainEffect";

class BloodEffect {
    constructor() {

    }

    finalize() {

    }

    play(args) {
        let x = args["x"]
        let y = args["y"]
        let value = args["value"]
        let hurtType = args["hurtType"]
        let parent = args["parent"]
        let actionTime = args["actionTime"]
        let effectType = HurtEffectType[hurtType]
        let callback = args["callback"]
        let effectNode = args["effectNode"]
        let curCount = args["curCount"]
        let fCount = args["fCount"]
        let item = effectNode

        let release = function () {
            callback();
        }

        let effectClass = this.getEffectByType(effectType);
        let effect = new effectClass();
        let delay = 50;
        effect.play(item, delay / 1000, release, null, actionTime, curCount, fCount, hurtType)

    }
    getEffectByType(effectType) {
        let effectClass = null;
        effectType = effectType || "BloodMinusEffect";
        if (effectType == "BloodMinusEffect") {
            effectClass = BloodMinusEffect;
        } else if (effectType == "BloodCritEffect") {
            effectClass = BloodCritEffect;
        } else if (effectType == "BloodRateEffect") {
            effectClass = BloodRateEffect;
        } else if (effectType == "BloodRefrainEffect") {
            effectClass = BloodRefrainEffect;
        }
        return effectClass;
    }
}

export default new BloodEffect()


