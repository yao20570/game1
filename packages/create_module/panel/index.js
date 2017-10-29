// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>创建模块</h2>
    <hr />
    <div>模块名：<ui-input type="text" id="moduleName"></ui-input></div>
    <hr />
    <div>面板名：<ui-input type="text" id="panelName"></ui-input></div>
    <hr />
    <div>创建模块工具，当面板名为空时，则创建出整个模块模板，面板名不为空时，则创建对应的模块的面板模板</div>
    <hr />
    <div>命名规则：模块名首字符小写；模块面板名首字母大写，自动增加Panel后缀</div>
    <hr />
    <ui-button id="btn">创建</ui-button>
  `,

  // element and variable binding
  $: {
    btn: '#btn',
    moduleName: '#moduleName',
    panelName: '#panelName'
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.$btn.addEventListener('confirm', () => {
      Editor.log(this.$moduleName.value);

      // Editor.Scene.callSceneScript('create_module', 'get-canvas-children', function (err, length) {
      //   console.log(`get-canvas-children callback :  length - ${length}`);
      // });

      Editor.Ipc.sendToMain('create_module:clicked', this.$moduleName.value, this.$panelName.value);
    });
  },

  // register your ipc messages here
  messages: {
    // 'create_module:hello' (event) {
    //   this.$label.innerText = 'Hello!';
    // }
  }
});