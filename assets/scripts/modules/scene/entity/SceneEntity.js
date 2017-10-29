/**
 * 场景实体基类
 * Created by on 2017/10/21.
 */
import BasicComponent from "BasicComponent";
class SceneEntity extends BasicComponent{

    constructor(){
        super();
        this._modelId = null;
    }

    initComponent(){
        this.addModel();
    }

    addModel(){
        let modelNode = new cc.Node();
        modelNode.parent = this._parent;
        modelNode.addComponent(sp.Skeleton);
        this._model = modelNode.getComponent(sp.Skeleton);
        this._model.premultipliedAlpha = false;
        this.node.addChild(modelNode);
        this.updateModel(this._modelId);
    }

    updateModel(modelId){
        this._modelId = modelId;
        if(this._model == null){
            return;
        }
        if(modelId == null){
            return;
        }


        let url = "model/" + modelId + "/skeleton";
        cc.loader.loadRes(url, sp.SkeletonData, (err, data) => {
            this._model.skeletonData = data;
            this._model.animation = "wait";
        });
    }
}

export default SceneEntity;