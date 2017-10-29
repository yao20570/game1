'use strict';

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  createModuleFile(moduleName, subType, fileName, tplName, panelName) {
    //创建目录
    let moduleUrl = 'db://assets/scripts/modules/' + moduleName + "/";
    let url = moduleUrl + subType + "/";

    let isExists = Editor.assetdb.exists(url);
    if (isExists == false) {
      Editor.assetdb.create(url);
    }

    // Editor.log("创建目录：" + url + " " + isExists);

    let fileUrl = url + fileName;
    isExists = Editor.assetdb.exists(fileUrl);

    let upModuleName = moduleName[0].toUpperCase() + moduleName.slice(1);
    if (isExists == false) {
      let fspath = Editor.assetdb.urlToFspath('db://create_module-templates/' + tplName);
      var fs = require('fs');

      fs.readFile(fspath, (err, data) => {
        let moduleContext = data.toString();
        moduleContext = moduleContext.replace(new RegExp('#moduleName#', "gm"), upModuleName);
        moduleContext = moduleContext.replace(new RegExp('#panelName#', "gm"), panelName);
        Editor.assetdb.create(fileUrl, moduleContext);
      });
    }
  },

  reg_Module_In_GameModule_File(moduleName) {
    Editor.log("reg_Module_In_GameModule_File ======> start");
    moduleName = moduleName + "Module";
    let moduleUrl = 'db://assets/scripts/game/const/GameModule.js';
    let fspath = Editor.assetdb.urlToFspath(moduleUrl);
    var fs = require('fs');
    fs.readFile(fspath, (err, data) => {
      let context = data.toString();
      Editor.log(context)
      let retStr = "GameModule." + moduleName + " = \"" + moduleName + "\";";
      //Editor.log(retStr)
      if (context.indexOf(moduleName) >= 0) {
        Editor.log("在scripts/game/const/GameModule.js里已注册" + moduleName);
        return;
      }

      if (context.indexOf('//Name:Creator自动注册标记') < 0) {
        Editor.log("在scripts/game/const/GameModule.js里找不到'//Name:Creator自动注册标记'，注册失败");
      }
      else {
        context = context.replace(new RegExp('//Name:Creator自动注册标记', "gm"), retStr + "\n//Name:Creator自动注册标记");
        //Editor.log(context);        
        Editor.assetdb.delete(moduleUrl);
        Editor.assetdb.create(moduleUrl, context);
      }
    });
  },

  reg_Module_In_GameModuleMap_File(moduleName) {
    Editor.log("reg_Module_In_GameModuleMap_File ======> start");
    moduleName = moduleName + "Module";
    let moduleUrl = 'db://assets/scripts/game/const/GameModuleMap.js';
    let fspath = Editor.assetdb.urlToFspath(moduleUrl);
    var fs = require('fs');
    fs.readFile(fspath, (err, data) => {
      let context = data.toString();
      //Editor.log(context)
      

      if (context.indexOf('//Import:Creator自动注册标记') < 0) {
        Editor.log("在scripts/game/const/GameModuleMap.js里找不到'//Import:Creator自动注册标记'，注册失败");
        return;
      }

      if (context.indexOf('//Name:Creator自动注册标记') < 0) {
        Editor.log("在scripts/game/const/GameModuleMap.js里找不到'//Name:Creator自动注册标记'，注册失败");
        return;
      }

      if (context.indexOf('//Class:Creator自动注册标记') < 0) {
        Editor.log("在scripts/game/const/GameModuleMap.js里找不到'//Class:Creator自动注册标记'，注册失败");
        return;
      }
      
      let strImport = "import " + moduleName + " from \"" + moduleName + "\";"; 
      if (context.indexOf(strImport) < 0) {
        context = context.replace(new RegExp('//Import:Creator自动注册标记', "gm"), strImport + "\n//Import:Creator自动注册标记");
      }      

      let strName = "GameModuleMap[GameModule." + moduleName + "] = " + moduleName + ";";
      if (context.indexOf(strName) < 0) {
        context = context.replace(new RegExp('//Name:Creator自动注册标记', "gm"), strName + "\n//Name:Creator自动注册标记");
      }

      let strClass = "GameModule." + moduleName + ",";
      if (context.indexOf(strClass) < 0) {
        context = context.replace(new RegExp('//Class:Creator自动注册标记', "gm"), strClass + "\n    //Class:Creator自动注册标记");
      }      

      Editor.assetdb.delete(moduleUrl);
      Editor.assetdb.create(moduleUrl, context);

    });
  },

  createModule(moduleName, panelName) {
    
    if (moduleName == "") {
      Editor.log('请输入模块名称');
      return;
    }

    let reg = /^[A-Z]+$/;
    if (reg.test(moduleName[0])) {
      Editor.log('模块名首字母修需要小写');
      return;
    }

    if (panelName != "" && panelName != null) {
      if (!reg.test(panelName[0])) {
        Editor.log('模块面板名首字母需要大写');
        return;
      }
      Editor.log('创建模块面板:' + moduleName + " " + panelName);
      this.createModuleFile(moduleName, "panel", panelName + "Panel.js", 'Panel.tpl', panelName);
      return;
    }

    let upModuleName = moduleName[0].toUpperCase() + moduleName.slice(1);
    Editor.log('创建模块:' + moduleName);
    this.createModuleFile(moduleName, "", upModuleName + "Module.js", 'Module.tpl');
    this.reg_Module_In_GameModule_File(upModuleName);
    this.reg_Module_In_GameModuleMap_File(upModuleName);



    this.createModuleFile(moduleName, "action", upModuleName + "Action.js", 'Action.tpl');
    this.createModuleFile(moduleName, "panel", upModuleName + "Panel.js", 'Panel.tpl');
    this.createModuleFile(moduleName, "store", upModuleName + "Store.js", 'Store.tpl');
    this.createModuleFile(moduleName, "view", upModuleName + "View.js", 'View.tpl');
    setTimeout(() => {
      this.createModuleFile(moduleName, "action", upModuleName + "ActionTypes.js", 'ActionTypes.tpl');
    }, 100);

  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('create_module');
    },
    'say-hello'() {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('create_module', 'create_module:hello');
    },
    'clicked'(event, moduleName, panelName) {

      this.createModule(moduleName, panelName);
    }
  },





};