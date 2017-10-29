/**
 * 入口场景UI
 */
var MainUI = qc.defineBehaviour('qc.landlord.MainUI', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    this.singleBtn = null;
    this.multiBtn = null;
}, {
    // fields need to be serialized
    singleBtn : qc.Serializer.NODE,
    multiBtn: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
MainUI.prototype.awake = function() {

    var self = this;
    
    // 下载excel文件
    self.game.assets.load('config', 'Assets/excel/config.bin', function(r) {
        if (!r) {
            alert('Download fail.');
            return;
        }

        // 下载成功
        G.cardManager.init();
    });
    
    G.hiddenCards = [];
    // G.currentCards = [];
    
    // “单机”按钮
    self.singleBtn.onClick.add(function() {
        
        var storage = G.game.storage;
        
        // 玩家本人
        G.ownPlayer = new qc.landlord.Player('QCPlayer');
        G.ownPlayer.isAI = false;
        var ownScore = storage.get('QCPlayer');
        G.ownPlayer.score = ownScore ? ownScore : 0;
        
        // 上家(电脑)
        G.formerPlayer = new qc.landlord.Player('AI_Former');
        var formerScore = storage.get('AI_Former');
        G.formerPlayer.score = formerScore ? formerScore : 0;
        
        // 下家(电脑)
        G.nextPlayer = new qc.landlord.Player('AI_Next');
        var nextScore = storage.get('AI_Next');
        G.nextPlayer.score = nextScore ? nextScore : 0;

        //指定玩家顺序
        G.ownPlayer.nextPlayer = G.nextPlayer;
        G.nextPlayer.nextPlayer = G.formerPlayer;
        G.formerPlayer.nextPlayer = G.ownPlayer;
        
        self.game.state.load('single');
    });
};

// Called every frame, if the behaviour is enabled.
//MainUI.prototype.update = function() {
//
//};
