import GameProxy from "GameProxy";


class Debug {
    create(game) {
        this._game = game

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    getProxy(proxyName) {
        return this._game.getProxy(proxyName);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.KEY.f1:
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.f1:
                //this.onZuoBi_GetSolider()
                this.onAtkBanditDungeon()
                break;
        }
    }

    onZuoBi_GetSolider() {
        let chatProxy = this.getProxy(GameProxy.Chat);
        let data = {};
        data.type = 1;
        data.contextType = 1;
        data.context = "zb as 10";
        chatProxy.onTriggerNet140000Req(data)
    }

    onAtkBanditDungeon() {
        let banditDungeonProxy = this.getProxy(GameProxy.BanditDungeon);
        let bandit = banditDungeonProxy.getOneBandit()

        let sendBattleData = {}
        sendBattleData.id = bandit.id;
        sendBattleData.infos = [{ num: 5, post: 1, typeid: 409 }];
        sendBattleData.saveTraffic = 0;
        banditDungeonProxy.onTriggerNet340001Req(sendBattleData)
    }
}

export default new Debug();
