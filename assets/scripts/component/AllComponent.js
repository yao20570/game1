/**
 * Created by on 2017/9/26.
 */
class AllComponent{

    constructor(){
        this._prefabMap = {};
    }

    addComponentPrefab(name, prefab){
        this._prefabMap[name] = prefab;
    }

    getComponentPrefab(name){
        return this._prefabMap[name];
    }

    getInstantiate(name){
        let prefab = this.getComponentPrefab(name);
        let node = cc.instantiate(prefab);
        node.x = 0;
        node.y = 0;
        return node;
    }
}

AllComponent.uiSecLvPanel = "UISecLvPanel";

export default new AllComponent();