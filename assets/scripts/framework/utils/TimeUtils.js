/**
 * Created by on 2017/9/19.
 */

import StringUtils from "StringUtils";

class TimeUtils{

    //获取时间戳 单位：秒
    getStampTime(){
        return Math.floor((new Date()).valueOf() / 1000);
    }

    //2位数对齐：小于10补0
    leftComplete(value, maxValue) {
        return parseInt(value) < maxValue ? "0" + value : value;
    }
    
    //时
    getHours(timeStamp) {
        return Math.floor(timeStamp / 3600);
    }
    //分
    getMinutes(timeStamp) {
        return Math.floor(timeStamp % 3600 / 60);
    }
    //秒
    getSeconds(timeStamp) {
        return Math.floor(timeStamp % 3600 % 60);
    }

    //时间戳转换成时间格式00:00:00
    getFormatTimeString1(timeStamp) {
        let hours = this.getHours(timeStamp);
        let minutes = this.getMinutes(timeStamp);
        let seconds = this.getSeconds(timeStamp);

        hours = this.leftComplete(hours);
        minutes = this.leftComplete(minutes);
        seconds = this.leftComplete(seconds);

        let formatTime = StringUtils.format('{0}:{1}:{2}', hours, minutes, seconds);
        return formatTime;        
    }
    
}

export default new TimeUtils();