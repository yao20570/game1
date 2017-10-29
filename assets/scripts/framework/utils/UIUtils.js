class UIUtils {
    //创建精灵
    createSprite(name, url) {
        let node = new cc.Node(name);
        this.setSprite(node, url);
        return node;
    }

    //更新精灵纹理
    //@param node 要替换的node上应该要有cc.sprite组件
    //@param url  url的路径以 assets路径为根目录 通常资源放在resources文件夹下  示例: url = "resources/bg/battle/101/bg.webp"
    setSprite(node, url){     
        let sprite = node.getComponent(cc.Sprite);   
        if (sprite == null){
            sprite = node.addComponent(cc.Sprite);
        }
        
        let rawUrl = cc.url.raw(url);
        if(sprite.spriteFrame && sprite.spriteFrame.rawUrl == rawUrl){
            //相同的图片
            return;
        }

        //let urlTrue = "res/raw-assets/"+url;
        cc.loader.load(rawUrl, function (err, texture) {
            console.assert(err == null, err)
            if (err == null) {
                var sf = new cc.SpriteFrame(texture);
                sprite.spriteFrame = sf;
            } 
        });
    }

    //创建按钮
    createButton(){
        logger.info("后面再补")
        
    }
    setButton(node, event){
        logger.info("后面再补")
    }

    //创建文本
    createButton(){
        logger.info("后面再补")
    }
    setString(node, str){
        let label = node.getComponent(cc.Label);
        label.string = str;
    }

    //创建进度条
    createProgress(){
        logger.info("后面再补")
    }
    //设置进度 num( 0 ~ 1 )
    setPercent(node, num){
        let progressBar = node.getComponent(cc.ProgressBar);
        progressBar.progress = num ;
    }
    

    setString(node, str){
        let label = node.getComponent(cc.Label);
        label.string = str;
    }

    //设置进度 num( 0 ~ 100 )
    setProgress(node, num){
        let progressBar = node.getComponent(cc.ProgressBar);
        progressBar.progress = curProgress / 100;
    }
    

}

export default new UIUtils();