// define a user behaviour
var SingleUI = qc.defineBehaviour('qc.landlord.SingleUI', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    
    /**
     * 用于抢地主
     */
    // 标识由谁开始叫地主，0则随机，否则除3取余，每次递增
    this.startNo = 0;
    // 当前叫分
    this.currentScore = 0;
    // 当前次数
    this.round = 0;
    // 当前地主
    this.currentLandlord = null;
    
}, {
    // fields need to be serialized
    startBtn : qc.Serializer.NODE,                 // 开始按钮
    exitBtn : qc.Serializer.NODE,                  // 退出按钮
    cardPrefab : qc.Serializer.PREFAB,             // 纸牌预制
    playMsgPrefab : qc.Serializer.PREFAB,          // 打牌、叫分信息预制
    ownPlayerArea : qc.Serializer.NODE,            // 玩家区域
    ownCardsContainer : qc.Serializer.NODE,        // 玩家牌区 
    ownCardsArea : qc.Serializer.NODE,             // 玩家出牌区
    formerPlayerArea : qc.Serializer.NODE,         // 上家区域
    formerCardsContainer : qc.Serializer.NODE,     // 上家牌区
    formerCardsArea : qc.Serializer.NODE,          // 上家出牌区
    nextPlayerArea : qc.Serializer.NODE,           // 下家区域
    nextCardsContainer : qc.Serializer.NODE,       // 下家牌区
    nextCardsArea : qc.Serializer.NODE,            // 下家出牌区
    claimOneBtn : qc.Serializer.NODE,              // 叫1分按钮
    claimTwoBtn : qc.Serializer.NODE,              // 叫2分按钮
    claimThreeBtn : qc.Serializer.NODE,            // 叫3分按钮
    noClaimBtn : qc.Serializer.NODE,               // 不叫按钮
    gameMessage : qc.Serializer.NODE,              // 游戏消息
    scorePanel : qc.Serializer.NODE,               // 底分
    ratePanel : qc.Serializer.NODE                 // 倍数
});

// Called when the script instance is being loaded.
SingleUI.prototype.awake = function() {
	var self = this;
    
    // 设置随机开始叫地主的位置
    self.startNo = 0;

    // 事件
    self.startBtn.onClick.add(self.startGame, self);
    self.exitBtn.onClick.add(self.exitGame, self);
    self.claimOneBtn.onClick.add(function(){
        self.playerClaim(1)}, self);
    self.claimTwoBtn.onClick.add(function(){
        self.playerClaim(2)}, self);
    self.claimThreeBtn.onClick.add(function(){
        self.playerClaim(3)}, self);
    self.noClaimBtn.onClick.add(function(){
        self.playerClaim(0)}, self);
};

/**
 * 开始游戏
 */
SingleUI.prototype.startGame = function(){
    var self = this;
    
    G.hiddenCards = [];
    // G.currentCards = [];
    G.ownPlayer.cardList = [];
    self.destroyChildren(self.ownCardsContainer);
    G.formerPlayer.cardList =[];
    self.destroyChildren(self.formerCardsContainer);
    G.nextPlayer.cardList = [];
    self.destroyChildren(self.nextCardsContainer);

    // 还原抢地主数据
    self.currentScore = 0;
    self.round = 0;
    self.currentLandlord = null;
    // self.scorePanel.text = '0';
    // self.ratePanel.text = '1';
    
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

    // 发牌开始后禁止退出，待发完牌后再恢复
    self.exitBtn.onClick.removeAll();

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
            // 发牌完毕，恢复退出按钮的点击事件
            self.exitBtn.onClick.add(self.exitGame, self);

            G.formerPlayer.cardList.sort(cardManager.compare);
            G.nextPlayer.cardList.sort(cardManager.compare);
            // G.ownPlayer.cardList.sort(G.gameRule.cardSort);
            // for (i = 0; i < G.currentCards.length; i++) {
            //     G.currentCards[i].getScript('qc.engine.CardUI').isSelected = false;
            // }
            // 进入抢地主阶段
            self.claimLord();
        }
    };
    deal();
};

/**
 * 将card插入到玩家的有序牌组中
 * @param  {Card} card [description]
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
    self.ownCardsContainer.setChildIndex(c, insertIndex);
    c.getScript('qc.landlord.CardUI').show(card);
};

/**
 * 开始抢地主
 * @return {[type]} [description]
 */
SingleUI.prototype.claimLord = function(){
    var self = this;

    if(self.startNo === 0) {
        self.startNo = self.game.math.random(1, 3);
    }

    var position = self.startNo++ % 3;
    var firstPlayer = (position === 0 ? G.ownPlayer : (
        position === 1 ? G.nextPlayer : G.formerPlayer))

    self.claimScore(firstPlayer);
};

/**
 * [claimScore description]
 * @param  {Player} player [description]
 * @return {[type]}        [description]
 */
SingleUI.prototype.claimScore = function(player){
    var self = this;

    if(player.isAI) {
        self.noClaimBtn.visible = false;
        self.claimThreeBtn.visible = false;
        self.claimTwoBtn.visible = false;
        self.claimOneBtn.visible = false;

        self.game.timer.add(1000, function(){
            // 根据下家是否是AI判断出牌区
            var area = player.nextPlayer.isAI ? self.nextCardsArea : self.formerCardsArea;

            // 清除之前的叫分信息
            self.destroyChildren(area);

            var message = self.game.add.clone(self.playMsgPrefab, area);
                
            var ratingScore = (new AI(player)).getCardsRating();

            if(ratingScore > self.currentScore) { // 叫分
                message.text = ratingScore + '分';

                // 每次叫分将round置为1
                self.round = 1;

                self.currentScore = ratingScore;
                self.scorePanel.text = ratingScore + '';
                self.currentLandlord = player;

                if(ratingScore === 3){ // 三分得地主
                    self.setLandlord(player);
                    return;
                }

            } else {
                message.text = '不叫';
                self.round++;
            }

            if(self.round === 3) { // 已连续叫分或不叫三次

                if(self.currentLandlord){
                    // 最后叫分的得地主
                    self.setLandlord(self.currentLandlord);

                } else {
                    self.game.timer.add(1000, function(){
                        // 无人叫分，重新开始
                        self.showRestartMessage();
                        self.startGame();
                    });
                }
            } else {
                self.claimScore(player.nextPlayer);
            }
        });

    } else {
        self.noClaimBtn.visible = true;
        self.claimThreeBtn.visible = true;

        if(self.currentScore < 2) {
            self.claimTwoBtn.visible = true;
        }

        if(self.currentScore < 1) {
            self.claimOneBtn.visible = true;
        }
    }
};

/**
 * 玩家叫分
 * @param  {int} score [description]
 * @return {[type]}       [description]
 */
SingleUI.prototype.playerClaim = function(score){
    var self = this;

    self.noClaimBtn.visible = false;
    self.claimThreeBtn.visible = false;
    self.claimTwoBtn.visible = false;
    self.claimOneBtn.visible = false;
    // 清除之前的叫分信息
    self.destroyChildren(self.ownCardsArea);

    var message = self.game.add.clone(self.playMsgPrefab, self.ownCardsArea);
        
    if(score === 0) {
        message.text = '不叫';
        self.round++;

    } else if(score < 4) { // 叫分
        message.text = score + '分';

        // 每次叫分将round置为1
        self.round = 1;

        self.currentScore = score;
        self.scorePanel.text = score + '';
        self.currentLandlord = G.ownPlayer;

        if(score === 3){ // 三分得地主
            self.setLandlord(G.ownPlayer);
            return;
        }

    } else {
        self.game.log.error('score参数错误');
    }

    if(self.round === 3) { // 已连续叫分或不叫三次

        if(self.currentLandlord){
            // 最后叫分的得地主
            self.setLandlord(self.currentLandlord);

        } else {
            self.game.timer.add(1000, function(){
                // 无人叫分，重新开始
                self.showRestartMessage();
                self.startGame();
            });
        }
    } else {
        self.claimScore(G.ownPlayer.nextPlayer);
    }
};

/**
 * [setLandlord description]
 * @param {[type]} player [description]
 */
SingleUI.prototype.setLandlord = function(player){
    var self = this;

    console.info('地主确定：' + player.name);
};

/**
 * 显示重新开始的提示语句
 */
SingleUI.prototype.showRestartMessage = function (){
    var self = this,
        msg = self.gameMessage;

    self.clearAllCardsArea();

    msg.visible = true;
    self.game.timer.add(1500, function(){
        msg.visible = false;
    });
};

SingleUI.prototype.destroyChildren = function(parent) {
    var self = this,
        childrens = parent.children;

    for(var i in childrens) {
        childrens[i].destroy();
    }
};

SingleUI.prototype.clearAllCardsArea = function (){
    var self = this;

    destroyChildren(self.ownCardsArea);
    destroyChildren(self.formerCardsArea);
    destroyChildren(self.nextCardsArea);
};

/**
 * 退出游戏
 */
SingleUI.prototype.exitGame = function(){
    var self = this;
    
    self.game.state.load('main');
};
