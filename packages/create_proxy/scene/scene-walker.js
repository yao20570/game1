/**
 * Created by on 2017/10/14.
 */
module.exports = {
    'get-canvas-children': function (event) {
        var canvas = cc.find('Canvas');
        Editor.log('children length : ' + canvas.children.length);

        if (event.reply) {
            event.reply(canvas.children.length);
        }
    }
};