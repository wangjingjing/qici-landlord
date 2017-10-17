// define a user behaviour
var SingleUI = qc.defineBehaviour('qc.landlord.SingleUI', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    
    /**
     * 用于抢地主
     */
    //当前最高分
    this.currentScore = 0;
    //当前次数
    this.round = 0;
    //当前地主
    this.currentLandlord = null;
    
}, {
    // fields need to be serialized
    startBtn : qc.Serializer.NODE,
    exitBtn : qc.Serializer.NODE,
    cardPrefab: qc.Serializer.PREFAB,
    ownPlayerArea : qc.Serializer.NODE,
    ownCardsContainer : qc.Serializer.NODE,
    formerPlayerArea : qc.Serializer.NODE,
    formerCardsContainer : qc.Serializer.NODE,
    nextPlayerArea : qc.Serializer.NODE,
    nextCardsContainer : qc.Serializer.NODE
});

// Called when the script instance is being loaded.
SingleUI.prototype.awake = function() {
	var self = this;
    
    // 事件
    self.startBtn.onClick.add(self.startGame, self);
    self.exitBtn.onClick.add(self.exitGame, self);
};

/**
 * 退出游戏
 */
SingleUI.prototype.exitGame = function(){
    var self = this;
    
    self.game.state.load('main');
};

/**
 * 开始游戏
 */
SingleUI.prototype.startGame = function(){
    var self = this;
    
    G.hiddenCards = [];
    // G.currentCards = [];
    
    self.startBtn.visible = false;
    
    // 重新发牌
    self.dealCards();
};

/**
 * 发牌
 */
SingleUI.prototype.dealCards = function(){
    var self = this,
        cardManager = G.cardManager;
        cards = cardManager.getNewPackOfCards();

    // 抽三张底牌
    for (var i = 0; i < 3; i++) {
        G.hiddenCards.push(cardManager.getOneCard(cards));
    }
    
    // 每人手牌数
    var total = 17;
    
    var deal = function (){
        
        // 上家电脑发牌
        card = cardManager.getOneCard(cards);
        G.formerPlayer.cardList.push(card);
        
        var c = self.game.add.clone(self.cardPrefab, self.formerCardsContainer);
        c.visible = true;
        c.interactive = false;
        
        // 下家电脑发牌
        card = cardManager.getOneCard(cards);
        G.nextPlayer.cardList.push(card);
        
        c = self.game.add.clone(self.cardPrefab, self.nextCardsContainer);
        c.visible = true;
        c.interactive = false;
        
        // 玩家的牌
        card = cardManager.getOneCard(cards);
        // G.ownPlayer.cardList.push(card);
        self.insertIntoOwnerCards(card);

        if ( --total > 0) {
            self.dealTimer = self.game.timer.add(200, deal);
            
        } else {
            //G.formerPlayer.cardList.sort(G.gameRule.cardSort);
            //G.nextPlayer.cardList.sort(G.gameRule.cardSort);
           // G.ownPlayer.cardList.sort(G.gameRule.cardSort);
           // for (i = 0; i < G.currentCards.length; i++) {
           //     G.currentCards[i].getScript('qc.engine.CardUI').isSelected = false;
           // }
            //进入抢地主阶段
           // self.robLandlord();
        }
    };
    deal();
};

/**
 * [insertIntoOwnerCards description]
 * @param  {[type]} card [description]
 * @return {[type]}      [description]
 */
SingleUI.prototype.insertIntoOwnerCards = function(card){
    var self = this,
        insertIndex = 0,
        currentCards = G.ownPlayer.cardList;
    
    if(currentCards.length > 0 && 
        G.cardManager.compare(card, currentCards[0]) > 0) { // 牌值小或花色值大
        
        insertIndex = G.cardManager.getIndex(currentCards, card);
    }

    currentCards.splice(insertIndex, 0, card);

    var c = self.game.add.clone(self.cardPrefab, self.ownCardsContainer);
    c.getScript('qc.landlord.CardUI').show(card);
    self.ownCardsContainer.setChildIndex(c, insertIndex);
};
// Called every frame, if the behaviour is enabled.
//SingleUI.prototype.update = function() {
//
//};
