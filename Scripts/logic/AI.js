/**
 * AI逻辑
 *
 */
var AI = qc.landlord.AI = function (player){
    this.player = player;
    this.cards = player.cardList.slice(0);
    this.analyse();
};

AI.prototype.analyse = function() {
    var self = this,
        cardsCopy = self.cards.slice(0);

    // TODO
    self._bomb = [];
    self._kingBomb = [];

    console.info('手牌：' + self.cards.join('-'));
};

/**
 * 手牌评级,用于AI叫分
 * 
 * @return {int} [description]
 */
AI.prototype.getCardsRating = function() {
    var self = this,
        score = 0;

    // 有炸弹加六分
    score += self._bomb.length * 6;

    if(self._kingBomb.length > 0 ){
        // 王炸8分
        score += 8;

    } else {
        if(self.cards[0].value === 17){
            score += 4;

        } else if(self.cards[0].value === 16){
            score += 3;
        }
    }

    for (var i = 0; i < self.cards.length; i++) {
        if(self.cards[i].value === 15){
            score += 2;
        }
    }

    console.info(self.player.name + "手牌评分：" + score);

    if(score >= 7){
        return 3;
    } else if(score >= 5){
        return 2;
    } else if(score >= 3){
        return 1;
    } else { //不叫
        return 0;
    }
};
