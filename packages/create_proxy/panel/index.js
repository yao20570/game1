// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>创建Proxy</h2>
    <hr />
    <div>Proxy名：<ui-input type="text" id="proxyName"></ui-input></div>        
    <ui-button id="btn">创建</ui-button>
  `,

  // element and variable binding
  $: {
    btn: '#btn',
    proxyName: '#proxyName'    
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.$btn.addEventListener('confirm', () => {
      Editor.log(this.$proxyName.value);

      // Editor.Scene.callSceneScript('create_module', 'get-canvas-children', function (err, length) {
      //   console.log(`get-canvas-children callback :  length - ${length}`);
      // });

      Editor.Ipc.sendToMain('create_proxy:clicked', this.$proxyName.value);
    });
  },

  // register your ipc messages here
  messages: {
    // 'create_module:hello' (event) {
    //   this.$label.innerText = 'Hello!';
    // }
  }
});