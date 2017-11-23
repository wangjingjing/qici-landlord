/**
 * [description]
 */
var SingleUI = qc.defineBehaviour('qc.landlord.SingleUI', qc.Behaviour, function() {
    
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

    /**
     * 用于打牌
     */
    // 每回合胜出的牌型对象
    this.winCardType = null;
    // 每回合赢得牌权的玩家
    this.roundWinner = null;

    /**
     * 用于提示
     */
    this.promptTimes = 0;
    
    window.singleUI = this;
}, {
    // fields need to be serialized
    startBtn : qc.Serializer.NODE,                 // 开始按钮
    exitBtn : qc.Serializer.NODE,                  // 退出按钮
    hiddenCardsContainer : qc.Serializer.NODE,     // 底牌区
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
    ratePanel : qc.Serializer.NODE,                // 倍数
    passBtn : qc.Serializer.NODE,                  // 不要按钮
    promptBtn : qc.Serializer.NODE,                // 提示按钮
    playBtn : qc.Serializer.NODE                   // 出牌按钮
});

// Called when the script instance is being loaded.
SingleUI.prototype.awake = function() {
	var self = this;
    
    /** 屏蔽浏览器右击菜单 */
    if (window.Event) {
        window.document.captureEvents(Event.MOUSEUP);
    }
    function nocontextmenu(event) {
        event.cancelBubble = true;
        event.returnValue = false;
        return false;
    }
    function norightclick(event) {
        if (window.Event){
            if (event.which == 2 || event.which == 3)
                return false;
        } else if (event.button == 2 || event.button == 3){
            event.cancelBubble = true;
            event.returnValue = false;
            return false;
        }
    }
    window.document.oncontextmenu = nocontextmenu; // for IE5+
    window.document.onmousedown = norightclick; // for all others
    /** 屏蔽浏览器右击菜单 end*/

    // 设置随机开始叫地主的位置
    self.startNo = 0;

    // 事件
    self.startBtn.onClick.add(self.startGame, self);
    self.exitBtn.onClick.add(self.exitGame, self);
    self.claimOneBtn.onClick.add(function(){
        self.claimScoreEvent(1)}, self);
    self.claimTwoBtn.onClick.add(function(){
        self.claimScoreEvent(2)}, self);
    self.claimThreeBtn.onClick.add(function(){
        self.claimScoreEvent(3)}, self);
    self.noClaimBtn.onClick.add(function(){
        self.claimScoreEvent(0)}, self);
    self.passBtn.onClick.add(self.passEvent, self);
    // self.promptBtn.onClick.add(self., self);
    self.playBtn.onClick.add(self.playCardEvent, self);
};

/**
 * 开始游戏
 */
SingleUI.prototype.startGame = function(){
    var self = this;
    
    G.hiddenCards = [];
    for (var i in self.hiddenCardsContainer.children) {
        i.frame = 'bg.jpg';
    }

    G.ownPlayer.cardList = [];
    self.destroyChildren(self.ownCardsContainer);
    G.formerPlayer.cardList =[];
    self.destroyChildren(self.formerCardsContainer);
    G.nextPlayer.cardList = [];
    self.destroyChildren(self.nextCardsContainer);

    self.ownPlayerArea.getScript('qc.landlord.PlayerUI').header.visible = false;
    self.formerPlayerArea.getScript('qc.landlord.PlayerUI').header.visible = false;
    self.nextPlayerArea.getScript('qc.landlord.PlayerUI').header.visible = false;

    // 初始化抢地主数据
    self.currentScore = 0;
    self.round = 0;
    self.currentLandlord = null;
    self.scorePanel.text = '0';
    self.ratePanel.text = '1';

    // 初始化出牌数据
    self.winCardType = null;
    self.roundWinner = null;
    
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

    // TODO 测试数据
    var cheatCards_1 = [
        cards[11], cards[24], cards[37],
        cards[10], cards[23], cards[36],
        cards[9], cards[22], cards[35],
        cards[8], cards[21], cards[34],
        cards[16], cards[1], cards[3], 
        cards[4], cards[17]
    ];

    var cheatCards_2 = [
        cards[1], cards[14],
        cards[13], cards[12], cards[11],
        cards[10], cards[23],
        cards[9], cards[22],
        cards[8], cards[7],
        cards[6], cards[19],
        cards[2], cards[3], cards[4], cards[5]
    ];

    // 发牌开始后禁止退出，待发完牌后再恢复
    self.exitBtn.onClick.removeAll();

    // 抽三张底牌
    for (var i = 0; i < 3; i++) {
        G.hiddenCards.push(cardManager.getOneCard(cards));
    }
    
    // 每人手牌数
    var total = 17;

    var deal = function(){
        
        // 上家电脑发牌
        card = cardManager.getOneCard(cards);
        // G.formerPlayer.cardList.push(card);
        // var c = self.game.add.clone(self.cardPrefab, self.formerCardsContainer);
        // c.visible = true;
        // c.interactive = false;
        self.insertCard2List(card, G.formerPlayer.cardList, self.formerCardsContainer, true);
        
        // 下家电脑发牌
        card = cardManager.getOneCard(cards);
        // G.nextPlayer.cardList.push(card);
        // c = self.game.add.clone(self.cardPrefab, self.nextCardsContainer);
        // c.visible = true;
        // c.interactive = false;
        self.insertCard2List(card, G.nextPlayer.cardList, self.nextCardsContainer, true);

        // 玩家的牌
        card = cardManager.getOneCard(cards);
        // G.ownPlayer.cardList.push(card);
        // self.insertIntoOwnerCards(card);
        self.insertCard2List(card, G.ownPlayer.cardList, self.ownCardsContainer, true);

        if ( --total > 0) {
            self.dealTimer = self.game.timer.add(200, deal);
            
        } else {
            // 发牌完毕，恢复退出按钮的点击事件
            self.exitBtn.onClick.add(self.exitGame, self);

            // 进入抢地主阶段
            self.claimLord();
        }
    };
    deal();
};

// /**
//  * 将card插入到玩家的有序牌组中
//  * @param  {Card} card [description]
//  * @return {[type]}      [description]
//  */
// SingleUI.prototype.insertIntoOwnerCards = function(card){
//     var self = this,
//         insertIndex = 0,
//         currentCards = G.ownPlayer.cardList;
    
//     if(currentCards.length > 0 && 
//         G.cardManager.compare(card, currentCards[0]) > 0) { // 牌值小或花色值大
//         insertIndex = G.cardManager.getInsertIndex(currentCards, card);
//     }

//     currentCards.splice(insertIndex, 0, card);

//     var c = self.game.add.clone(self.cardPrefab, self.ownCardsContainer);
//     self.ownCardsContainer.setChildIndex(c, insertIndex);
//     c.getScript('qc.landlord.CardUI').show(card);
// };

/**
 * 将牌插入到指定玩家的有序牌组中
 * @param  {Card} card           待插入的牌
 * @param  {Array} cardList      要插入的牌数组
 * @param  {Node} cardsContainer 显示牌组的牌区
 */
SingleUI.prototype.insertCard2List = function(card, cardList, cardsContainer, showFlag) {
    var self = this,
        insertIndex = 0;

    if(cardList.length > 0 &&
        G.cardManager.compare(card, cardList[0]) > 0) {

        insertIndex = G.cardManager.getInsertIndex(cardList, card);
    }

    cardList.splice(insertIndex, 0, card);

    var c = self.game.add.clone(self.cardPrefab, cardsContainer);
    cardsContainer.setChildIndex(c, insertIndex);

    if(showFlag) {
        c.getScript('qc.landlord.CardUI').show(card);
    }
};

/**
 * 开始抢地主
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
 * 轮转叫分
 * @param  {Player} player [description]
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
                    self.confirmLandlord(player);
                    return;
                }

            } else {
                message.text = '不叫';
                self.round++;
            }

            if(self.round === 3) { // 已连续叫分或不叫三次

                if(self.currentLandlord){
                    // 最后叫分的得地主
                    self.confirmLandlord(self.currentLandlord);

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
 * 叫分按钮触发函数
 * @param  {int} score [description]
 */
SingleUI.prototype.claimScoreEvent = function(score){
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
            self.confirmLandlord(G.ownPlayer);
            return;
        }

    } else {
        self.game.log.error('score参数错误');
    }

    if(self.round === 3) { // 已连续叫分或不叫三次

        if(self.currentLandlord){
            // 最后叫分的得地主
            self.confirmLandlord(self.currentLandlord);

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
 * 确定地主
 */
SingleUI.prototype.confirmLandlord = function(player){
    var self = this;

    G.ownPlayer.isLandlord = false;
    G.formerPlayer.isLandlord = false;
    G.nextPlayer.isLandlord = false;
    player.isLandlord = true;

    // 显示头像，农民还是地主
    self.ownPlayerArea.getScript('qc.landlord.PlayerUI').setHeaderPic(
        G.ownPlayer.isLandlord);
    self.formerPlayerArea.getScript('qc.landlord.PlayerUI').setHeaderPic(
        G.formerPlayer.isLandlord);
    self.nextPlayerArea.getScript('qc.landlord.PlayerUI').setHeaderPic(
        G.nextPlayer.isLandlord);

    var playerCardContainer;
    if(G.ownPlayer.isLandlord) {
        playerCardContainer = self.ownCardsContainer;
    }else if(G.formerPlayer.isLandlord) {
        playerCardContainer = self.formerCardsContainer;
    }else if(G.nextPlayer.isLandlord) {
        playerCardContainer = self.nextCardsContainer;
    }else {
        self.game.log.error('逻辑错误，未确定地主！');
    }

    // 显示底牌，并把底牌发给地主
    for (var i = 0; i < G.hiddenCards.length; i++) {
        self.hiddenCardsContainer.children[i].frame = G.hiddenCards[i].icon;
        self.insertCard2List(G.hiddenCards[i], player.cardList,
            // playerCardContainer, !player.isAI);
            playerCardContainer, true);
    }

    console.info('地主确定：' + player.name);

    self.clearAllCardsArea();
    self.playCard(player);
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

    self.destroyChildren(self.ownCardsArea);
    self.destroyChildren(self.formerCardsArea);
    self.destroyChildren(self.nextCardsArea);
};

/**
 * 轮转出牌
 */
SingleUI.prototype.playCard = function(player) {
    var self = this,
        result = null;

    if(player.isAI) {

        var ai = new qc.landlord.AI(player);
        var area = player.nextPlayer.isAI ? self.nextCardsArea : self.formerCardsArea;
        var playerCardContainer = player.nextPlayer.isAI ? self.nextCardsContainer : self.formerCardsContainer;

        // 清除上次出的牌
        self.destroyChildren(area);

        self.game.timer.add(1000, function(){

            if(!self.roundWinner || self.roundWinner === player) {
                result = ai.playCard();
            } else {
                result = ai.followCard();
            }

            console.info(result);

            if(result) {

                // 将牌从牌区删除，显示到出牌区中
                for(var i in result.cards) {
                    var c = self.game.add.clone(self.cardPrefab, area);
                    c.getScript('qc.landlord.CardUI').show(result.cards[i]);
                    // 打出的牌不允许点击
                    c.interactive = false; 

                    var deleteIndex = G.cardManager.getDeleteIndex(player.cardList, result.cards[i]);
                    player.cardList.splice(deleteIndex, 1);
                    playerCardContainer.removeChildAt(deleteIndex);
                }

                if(result.type === G.gameRule.JOKER_BOMB || result.type === G.gameRule.BOMB) {
                    var rate = parseInt(self.ratePanel.text, 10);
                    self.ratePanel.text = (rate * 2) + '';
                }

                self.winCardType = result;
                self.roundWinner = player;

            } else {
                self.game.add.clone(self.playMsgPrefab, area);
            }

            if(player.cardList.length === 0) {
                self.judgeWinner(player);
            } else {
                self.playCard(player.nextPlayer);
            }
        });        
    } else {

        // 清除上次出的牌
        self.destroyChildren(self.ownCardsArea);

        if(self.getSelectedCardsType()) {
            self.playBtn.state = qc.UIState.NORMAL;
        } else {
            self.playBtn.state = qc.UIState.DISABLED;
        }

        self.playBtn.visible = true;
        self.promptBtn.visible = true;

        if(self.roundWinner && self.roundWinner !== player) {
            self.passBtn.visible = true;
        } else {
            self.winCardType = null;
        }

        self.promptTimes = 0;
    }
};

/**
 * “出牌”按钮点击事件
 */
SingleUI.prototype.playCardEvent = function() {
    var self = this,
        ownCardType = self.getSelectedCardsType();

    if(ownCardType) { // 牌型正确，可以出牌

        if(ownCardType.type === G.gameRule.JOKER_BOMB
            || ownCardType.type === G.gameRule.BOMB) {
            var rate = parseInt(self.ratePanel.text, 10);
            self.ratePanel.text = (rate * 2) + '';
        }

        self.winCardType = ownCardType;
        self.roundWinner = G.ownPlayer;

        // TODO

        if(G.ownPlayer.cardList.length === 0) {
            self.judgeWinner(G.ownPlayer);
        } else {
            self.playCard(G.ownPlayer.nextPlayer);
        }
    }
};

/**
 * 获取已选出的牌的牌型
 * 如果是跟牌，牌要大过要跟的牌
 * 
 * @return {[type]} [description]
 */
SingleUI.prototype.getSelectedCardsType = function(){
    var self = this,
        readyCards = [],
        ownCardUIList = self.ownCardsContainer.children;

    for(var i in ownCardUIList) {
        var cardUI = ownCardUIList[i].getScript('qc.landlord.CardUI');
        if(cardUI.isSelected) {
            readyCards.push(cardUI.cardObj);
        }
    }

    if(readyCards.length === 0) {
        return;
    }

    var cardType = G.gameRule.judgeCardType(readyCards);

    if(cardType) { // 牌型正确
        if(self.roundWinner && self.roundWinner !== G.ownPlayer) { // 跟牌
            
            return (function(winCardType, ownCardType) {
                // 王炸大过其他牌型
                // 炸弹大过非炸弹
                // 同牌型且同长度时牌值大
                if(ownCardType.type === G.gameRule.JOKER_BOMB
                    || (ownCardType.type === G.gameRule.BOMB
                        && winCardType.type !== G.gameRule.BOMB)
                    || (ownCardType.type === winCardType.type
                        && ownCardType.size === winCardType.size
                        && ownCardType.value > winCardType.value)) {

                    return cardType;
                }

            }(self.winCardType, cardType));

        } else {
            return cardType;
        }
    }

    return;
};


/**
 * “不要”按钮点击事件
 */
SingleUI.prototype.passEvent = function() {
    var self = this;
    self.restoreOwnCards();
    self.game.add.clone(self.playMsgPrefab, self.ownCardsArea);
    self.playCard(G.ownPlayer.nextPlayer);
};

/**
 * [restoreOwnCards description]
 * @return {[type]} [description]
 */
SingleUI.prototype.restoreOwnCards = function(){
    var ownCardUIList = this.ownCardsContainer.children;

    for (var i in ownCardUIList) {
        var cardUI = ownCardUIList[i].getScript('qc.landlord.CardUI');
        if(cardUI.isSelected){
            cardUI.anchoredY = 0;
            cardUI.isSelected = false;
        }
    }
};

/**
 * 退出游戏
 */
SingleUI.prototype.exitGame = function(){
    var self = this;
    
    self.game.state.load('main');
};
