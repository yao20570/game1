'use strict';

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  createProxyFile(proxyName, tplName) {

    let fileUrl = 'db://assets/scripts/game/proxy/' + proxyName + "Proxy.js";
    let isExists = Editor.assetdb.exists(fileUrl);

    if (isExists == false) {
      let fspath = Editor.assetdb.urlToFspath('db://create_proxy-templates/' + tplName);
      var fs = require('fs');

      fs.readFile(fspath, (err, data) => {
        let context = data.toString();
        context = context.replace(new RegExp('#proxyName#', "gm"), proxyName);
        Editor.assetdb.create(fileUrl, context);        
      });
    }
    else {
      Editor.log(proxyName + 'Proxy.js 已存在');
    }
  },

  reg_Proxy_In_GameProxy_File(proxyName) {
    Editor.log("reg_Proxy_In_GameProxy_File ======> start");

    let proxyUrl = 'db://assets/scripts/game/const/GameProxy.js';
    let fspath = Editor.assetdb.urlToFspath(proxyUrl);
    var fs = require('fs');
    fs.readFile(fspath, (err, data) => {
      let context = data.toString();
      Editor.log(context)
      let retStr = "GameProxy." + proxyName + " = \"" + proxyName + "\";";
      //Editor.log(retStr)
      if (context.indexOf(proxyName) >= 0) {
        Editor.log("在scripts/game/const/GameProxy.js里已注册" + proxyName);
        return;
      }

      if (context.indexOf('//Name:Creator自动注册标记') < 0) {
        Editor.log("在scripts/game/const/GameProxy.js里找不到'//Name:Creator自动注册标记'，注册失败");
      }
      else {
        context = context.replace(new RegExp('//Name:Creator自动注册标记', "gm"), retStr + "\n//Name:Creator自动注册标记");
        //Editor.log(context);        
        Editor.assetdb.delete(proxyUrl);
        Editor.assetdb.create(proxyUrl, context);
      }
    });
  },

  reg_Proxy_In_GameProxyMap_File(proxyName) {
    Editor.log("reg_Proxy_In_GameProxyMap_File ======> start");

    let proxyUrl = 'db://assets/scripts/game/const/GameProxyMap.js';
    let fspath = Editor.assetdb.urlToFspath(proxyUrl);
    var fs = require('fs');
    fs.readFile(fspath, (err, data) => {
      let context = data.toString();
      //Editor.log(context)
    
      if (context.indexOf('//Import:Creator自动注册标记') < 0) {
        Editor.log("在scripts/game/const/GameProxyMap.js里找不到'//Import:Creator自动注册标记'，注册失败");
        return;
      }

      if (context.indexOf('//Class:Creator自动注册标记') < 0) {
        Editor.log("在scripts/game/const/GameProxyMap.js里找不到'//Class:Creator自动注册标记'，注册失败");
        return;
      }

      let strImport = "import " + proxyName + "Proxy from \"" + proxyName + "Proxy\";";
      if (context.indexOf(strImport) < 0) {
        context = context.replace(new RegExp('//Import:Creator自动注册标记', "gm"), strImport + "\n//Import:Creator自动注册标记");         
      }

      let strName = "GameProxyMap[GameProxy." + proxyName + "] = " + proxyName + "Proxy;";
      if (context.indexOf(strName) < 0) {
        context = context.replace(new RegExp('//Class:Creator自动注册标记', "gm"), strName + "\n//Class:Creator自动注册标记");
      }
      
      Editor.assetdb.delete(proxyUrl);
      Editor.assetdb.create(proxyUrl, context);

    });
  },

  createProxy(proxyName) {

    if (proxyName == "") {
      Editor.log('请输入Proxy名称');
      return;
    }

    let reg = /^[a-z]+$/;
    if (reg.test(proxyName[0])) {
      Editor.log('Proxy名首字母修需要大写');
      return;
    }

    Editor.log('创建Proxy:' + proxyName);
    this.createProxyFile(proxyName, 'Proxy.tpl');
    this.reg_Proxy_In_GameProxy_File(proxyName)
    this.reg_Proxy_In_GameProxyMap_File(proxyName)
  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('create_proxy');
    },
    'say-hello'() {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('create_proxy', 'create_proxy:hello');
    },
    'clicked'(event, proxyName) {

      this.createProxy(proxyName);
    }
  },





};