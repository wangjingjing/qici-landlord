/**
 * AI逻辑
 */
var AI = qc.landlord.AI = function (player){
    var self = this;

    self.player = player;
    self.cards = player.cardList.slice(0);
    self.cardAnalysis = null;

    self.analyze();
};

AI.prototype.analyze = function() {
    var self = this,
        score = 0,
        cardAnalysis = null;

    console.info('原牌：' + self.cards);

    console.info('手牌分析一：王炸->顺子->炸弹->连对->飞机->三张->对->单');
    cardAnalysis = self.analyzePath_1(self.cards);
    console.info(cardAnalysis.getRatingScore());
    score = cardAnalysis.getRatingScore();
    self.cardAnalysis = cardAnalysis;
    console.info(cardAnalysis);
    

    console.info('手牌分析二：王炸->顺子->炸弹->飞机->三张->连对->对->单');
    cardAnalysis = self.analyzePath_2(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);

    console.info('手牌分析三：王炸->顺子->炸弹->飞机->连对->三张->对->单');
    cardAnalysis = self.analyzePath_3(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);

    console.info('手牌分析四：王炸->炸弹->顺子->连对->飞机->三张->对->单');
    cardAnalysis = self.analyzePath_4(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);

    console.info('手牌分析五：王炸->炸弹->顺子->飞机->三张->连对->对->单');
    cardAnalysis = self.analyzePath_5(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);

    console.info('手牌分析六：王炸->炸弹->顺子->飞机->连对->三张->对->单');
    cardAnalysis = self.analyzePath_6(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);

    console.info('手牌分析七：王炸->炸弹->连对->顺子->飞机->三张->对->单');
    cardAnalysis = self.analyzePath_7(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析八：王炸->炸弹->连对->飞机->顺子->三张->对->单');
    cardAnalysis = self.analyzePath_8(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析九：王炸->炸弹->连对->飞机->三张->顺子->对->单');
    cardAnalysis = self.analyzePath_9(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析十：王炸->炸弹->飞机->顺子->三张->连对->对->单');
    cardAnalysis = self.analyzePath_10(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析十一：王炸->炸弹->飞机->顺子->连对->三张->对->单');
    cardAnalysis = self.analyzePath_11(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析十二：王炸->炸弹->飞机->三张->顺子->连对->对->单');
    cardAnalysis = self.analyzePath_12(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析十三：王炸->炸弹->飞机->三张->连对->顺子->对->单');
    cardAnalysis = self.analyzePath_13(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析十四：王炸->炸弹->飞机->连对->顺子->三张->对->单');
    cardAnalysis = self.analyzePath_14(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('手牌分析十五：王炸->炸弹->飞机->连对->三张->顺子->对->单');
    cardAnalysis = self.analyzePath_15(self.cards);
    console.info(cardAnalysis.getRatingScore());
    if(cardAnalysis.getRatingScore() > score) {
        self.cardAnalysis = cardAnalysis;
        score = cardAnalysis.getRatingScore();
    }
    console.info(cardAnalysis);
    
    console.info('最终手牌：');
    console.info(self.cardAnalysis);
};

/**
 * 王炸->顺子->炸弹->连对->飞机->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_1 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->顺子->炸弹->飞机->三张->连对->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_2 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->顺子->炸弹->飞机->连对->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_3 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->顺子->连对->飞机->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_4 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->顺子->飞机->三张->连对->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_5 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->顺子->飞机->连对->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_6 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->连对->顺子->飞机->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_7 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->连对->飞机->顺子->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_8 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->连对->飞机->三张->顺子->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_9 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->飞机->顺子->三张->连对->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_10 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->飞机->顺子->连对->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_11 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->飞机->三张->顺子->连对->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_12 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->飞机->三张->连对->顺子->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_13 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->飞机->连对->顺子->三张->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_14 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 王炸->炸弹->飞机->连对->三张->顺子->对->单
 * @return {CardAnalysis} 牌型分析结果对象
 */
AI.prototype.analyzePath_15 = function(cards) {
    var self = this,
        cardsCopy = cards.slice(0);

    var ca = new qc.landlord.CardAnalysis();
    self.getJokerAndTwo(cardsCopy, ca);
    self.getJokerBomb(cardsCopy, ca);
    self.getBomb(cardsCopy, ca);
    self.getPlane(cardsCopy, ca);
    self.getDoubleStright(cardsCopy, ca);
    self.getTriple(cardsCopy, ca);
    self.getStraight(cardsCopy, ca);
    self.getPair(cardsCopy, ca);
    self.getSingle(cardsCopy, ca);

    return ca;
};

/**
 * 获取大王、小王和2
 * @param  {[type]} cards        [description]
 * @param  {[type]} cardAnalysis [description]
 * @return {[type]}              [description]
 */
AI.prototype.getJokerAndTwo = function(cards, cardAnalysis) {
    for(var i in cards) {
        if(cards[i].value === 17) {
            cardAnalysis.joker.push(cards[i]);
        } else if(cards[i].value === 16) {
            cardAnalysis.blackJoker.push(cards[i]);
        } else if(cards[i].value === 15) {
            cardAnalysis.two.push(cards[i]);
        }
    }
};

/**
 * 获取牌组中的王炸
 * @param  {Arrya[Card]} cards        [description]
 * @param  {CardAnalysis} cardAnalysis [description]
 */
AI.prototype.getJokerBomb = function(cards, cardAnalysis) {
    if(G.gameRule.isJokerBomb(cards.slice(0, 2))) {
        cardAnalysis.jokerBomb.push(new qc.landlord.CardType(
            G.gameRule.JOKER_BOMB, cards[0].value, cards.splice(0, 2)));
    }
};

/**
 * 获取牌组中的炸弹
 * @param  {Array[Card]} cards        [description]
 * @param  {CardAnalysis} cardAnalysis [description]
 */
AI.prototype.getBomb = function(cards, cardAnalysis) {
    var vc = G.gameRule.countValues(cards);
    for(var i in vc) {
        if(vc[i].count === 4) {
            var cardType = new qc.landlord.CardType(G.gameRule.BOMB, vc[i].value, []);
            this.moveSpecValueCard(cards, cardType.cards, vc[i].value);
            cardAnalysis.bomb.splice(0, 0, cardType);
        }
    }
};

/**
 * 获取牌组中的飞机
 * @param  {Array[Card]} cards         cards 有序牌组，牌值由大到小排列
 * @param  {CardAnalysis} cardAnalysis 牌型分析结果对象
 */
AI.prototype.getPlane = function(cards, cardAnalysis) {
    var tripleCards = [],  // 牌值相同数目为3的牌，牌值由大到小
        vc = G.gameRule.countValues(cards);

    for(var i in vc) {
        if(vc[i].count === 3) {
            this.moveSpecValueCard(cards, tripleCards, vc[i].value);
        }
    }

    /**
     * 递归分析三张牌组中的飞机，余下的就是三张
     * @param  {Array[Card]} tCards 牌值由大到小，形如：[A, A, A, K, K, K, 9, 9, 9]
     */
    var analyzePlane = function(tCards) {
        var len = tCards.length,
            tmp = [];

        for(var i = len - 3; i >= 0; i -=3) {
            if(i === 0 || tCards[i].value + 1 !== tCards[i - 3].value
                || tCards[i - 3].value === 15) {
                // 牌组中只有三张牌，如[A, A, A]
                // 或 当前牌值比往前数三张的牌值差大于1
                // 或 当前牌往前数三张的牌是2
                // 则把当前位置到牌组末尾的牌都从牌组中删除放入tmp中
                tmp = tCards.splice(i, len - i);
                break;
            }
        }

        if(tmp.length === 3) {
            // 不是飞机的牌放回到牌组中
            Array.prototype.push.apply(cards, tmp);
        } else {
            // 大于3张就是飞机
            var planeType = new qc.landlord.CardType(G.gameRule.PLANE, tmp[0].value, tmp);
            cardAnalysis.plane.push(planeType);
        }

        // 递归分析直到tCards中没有牌
        if(tCards.length > 0) {
            analyzePlane(tCards);
        }
    };

    if(tripleCards.length > 0) {
        analyzePlane(tripleCards);
        cards.sort(G.cardManager.compare);
    }
}

/**
 * 获取牌组中的三张
 * @param  {Array[Card]} cards         cards 有序牌组，牌值由大到小排列
 * @param  {CardAnalysis} cardAnalysis 牌型分析结果对象
 */
AI.prototype.getTriple = function(cards, cardAnalysis) {
    var tripleCards = [],  // 牌值相同数目为3的牌，牌值由大到小
        vc = G.gameRule.countValues(cards);

    for(var i in vc) {
        if(vc[i].count === 3) {
            this.moveSpecValueCard(cards, tripleCards, vc[i].value);
        }
    }

    for(var i = tripleCards.length - 3; i >= 0; i -= 3) {
        var tripleType = new qc.landlord.CardType(G.gameRule.TRIPLE,
            tripleCards[i].value, tripleCards.splice(i, 3));
        cardAnalysis.triple.push(tripleType);
    }
};

/**
 * 获取牌组中的顺子
 * @param  {Array[Card]} cards         cards 有序牌组，牌值由大到小排列
 * @param  {CardAnalysis} cardAnalysis 牌型分析结果对象
 */
AI.prototype.getStraight = function(cards, cardAnalysis) {
    var restCards = [],      // 保存分析5连顺子后余下的牌
        straightArrays = []; // 二维数组，保存分析出的顺子

    // 将大王、小王和2从牌组中移除，不做顺子分析
    for(var i = cards.length - 1; i >= 0; i--) {
        if(cards[i].value >= 15) {
            restCards.push(cards.splice(i, 1)[0]);
        }
    }

    /**
     * 递归分析牌组中的顺子，只取5连的顺子
     * @param  {Array[Card]} cards 有序牌组，牌值由大到小排列
     */
    var analyzeStraight = function(cards) {
        // 保存潜在可能组成顺子的牌，牌值由小到大
        var tmp = [];

        // console.info(cards + '');

        // 牌值由小到大循环
        for(var i = cards.length - 1; i >= 0; i--) {
            var len = tmp.length;

            if(len === 0) {
                tmp.push(cards.splice(i, 1)[0]);
                continue;
            }

            if(tmp[len - 1].value === cards[i].value) {
                // 如果与tmp中牌值最大的相等，则跳过
            } else if(tmp[len - 1].value + 1 === cards[i].value) {
                // 如果恰好比tmp中牌值最大的牌大1，则放入tmp中
                tmp.push(cards.splice(i, 1)[0]);
                if(tmp.length === 5) {
                    // 只取长度为5的顺子
                    straightArrays.push(tmp);
                    tmp = [];
                    break; // 一旦凑成五连则从最小的牌再次开始找顺子
                }
            } else {
                // 牌值间隔在2及以上，则清空tmp从新开始分析
                restCards = restCards.concat(tmp);
                tmp = [];
                tmp.push(cards.splice(i, 1)[0]);
            }
        }

        if(tmp.length > 0) {
            restCards = restCards.concat(tmp);
        }

        // 递归分析直到cards中没有牌
        if(cards.length > 0) {
            analyzeStraight(cards);
        }
    };

    if(cards.length > 0) {
        analyzeStraight(cards);
    }

    // 分析顺子后余下的牌是乱序的，排序后牌值由大到小
    restCards.sort(G.cardManager.compare);

    // 判断余下的牌中是否有可以接在顺子末端（牌值大）的牌
    for(var i in straightArrays) {
        var straight = straightArrays[i];

        for(var j = restCards.length - 1; j >= 0; j--) {

            if(restCards[j].value < 15 &&
                restCards[j].value - 1 === straight[straight.length - 1].value) {
                straight.push(restCards.splice(j, 1)[0]);
            }
        }
    }

    // 逆序，牌值由小到大
    restCards.reverse();

    // 判断余下的牌中是否有可以接在顺子前端（牌值小）的牌
    for(var i in straightArrays) {
        var straight = straightArrays[i];

        for(var j = restCards.length - 1; j >= 0; j--) {

            if(restCards[j].value + 1 === straight[0].value) {
                straight.splice(0, 0, restCards.splice(j, 1)[0]);
            }
        }
    }

    // console.info('顺：' + straightArrays);
    // console.info('剩：' + restCards);

    var joinedStraights = [];

    var joinStraight = function(straightArrays) {
        var straight_1 = straightArrays.splice(0, 1)[0];

        for(var i in straightArrays) {
            var straight_2 = straightArrays[i];

            if(straight_1[0].value - 1 === straight_2[straight_2.length -1].value) {
                straight_1 = straight_2.concat(straight_1);
                straightArrays.splice(i, 1);
                break;
            } else if(straight_1[straight_1.length - 1].value + 1 === straight_2[0].value) {
                straight_1 = straight_1.concat(straight_2);
                straightArrays.splice(i, 1);
                break;
            }
        }

        joinedStraights.push(straight_1);

        if(straightArrays.length > 0) {
            joinStraight(straightArrays);
        }
    };

    if(straightArrays.length > 1) {
        joinStraight(straightArrays);
        straightArrays = joinedStraights;
    }

    // 根据得到的顺子更新cardAnalysis对象
    for(var i in straightArrays) {
        var straight = straightArrays[i];
        var straightType = new qc.landlord.CardType(G.gameRule.STRAIGHT, 
            straight[straight.length - 1].value, straight);
        cardAnalysis.straight.push(straightType);
    }

    // 将余牌放回到cards中
    Array.prototype.push.apply(cards, restCards);
    cards.sort(G.cardManager.compare);
};

/**
 * 获取牌组中的连对
 * @param  {Array[Card]} cards         cards 有序牌组，牌值由大到小排列
 * @param  {CardAnalysis} cardAnalysis 牌型分析结果对象
 */
AI.prototype.getDoubleStright = function(cards, cardAnalysis) {
    var pairCards = [],  // 牌值相同数目为2的牌，牌值由大到小
        vc = G.gameRule.countValues(cards);

    for(var i in vc) {
        if(vc[i].count === 2) {
            this.moveSpecValueCard(cards, pairCards, vc[i].value);
        } else if(vc[i].count == 3) {
            this.moveSpecValueCard(cards, pairCards, vc[i].value, 2);
        }
    }

    /**
     * 递归分析对子牌组中的连对，余下的就是对
     * @param  {Array[Card]} pCards 牌值由大到小，形如：[9, 9, 7, 7, 6, 6, 3, 3]
     */
    var analyzeDoubleStright = function(pCards) {
        var len = pCards.length,
            tmp = [];

        for(var i = len - 2; i >= 0; i -=2) {
            if(i === 0 || pCards[i].value + 1 !== pCards[i - 2].value
                || pCards[i - 2].value === 15) {
                // 牌组中只有两张牌，如[9, 9]
                // 或 当前牌值比往前数两张的牌值差大于1
                // 或 当前牌往前数两张的牌是2
                // 则把当前位置到牌组末尾的牌都从牌组中删除放入tmp中
                tmp = pCards.splice(i, len - i);
                break;
            }
        }

        if(tmp.length < 6) {
            // 连对最少6张，不是连对的牌放回到牌组中
            Array.prototype.push.apply(cards, tmp);
        } else {
            // 6张及以上就是连对
            var doubleStrightType = new qc.landlord.CardType(
                G.gameRule.DOUBLE_STRAIGHT, tmp[0].value, tmp);
            cardAnalysis.doubleStraight.push(doubleStrightType);
        }

        // 递归分析直到pCards中没有牌
        if(pCards.length > 0) {
            analyzeDoubleStright(pCards);
        }
    };

    if(pairCards.length > 0) {
        analyzeDoubleStright(pairCards);
        cards.sort(G.cardManager.compare);
    }
};

/**
 * 获取牌组中的对子
 * @param  {Array[Card]} cards         cards 有序牌组，牌值由大到小排列
 * @param  {CardAnalysis} cardAnalysis 牌型分析结果对象
 */
AI.prototype.getPair = function(cards, cardAnalysis) {
    var pairCards = [],  // 牌值相同数目为2的牌，牌值由大到小
        vc = G.gameRule.countValues(cards);

    for(var i in vc) {
        if(vc[i].count === 2) {
            this.moveSpecValueCard(cards, pairCards, vc[i].value);
        }
    }

    for(var i = pairCards.length - 2; i >= 0; i -= 2) {
        var pairType = new qc.landlord.CardType(G.gameRule.PAIR, 
            pairCards[i].value, pairCards.splice(i, 2));
        cardAnalysis.pair.push(pairType);
    }
};
/**
 * [getSingle description]
 * @param  {[type]} cards        [description]
 * @param  {[type]} cardAnalysis [description]
 * @return {[type]}              [description]
 */
AI.prototype.getSingle = function(cards, cardAnalysis) {

    for(var i in cards) {
        var singleType = new qc.landlord.CardType(
            G.gameRule.SINGLE, cards[i].value, [cards[i]]);
        cardAnalysis.single.splice(0, 0, singleType);
    }
};

/**
 * 将指定牌值的牌对象从源牌组中移到新牌组中
 *
 * @param  {Array[Card]} from 源牌组
 * @param  {Array[Card]} to   新牌组
 * @param  {int} val          牌值
 * @param  {int} mount        需要的牌对象数量
 * @return {[type]}      [description]
 */
AI.prototype.moveSpecValueCard = function(from, to, val, mount) {
    var count = 0;

    for(var i = from.length - 1; i >= 0; i--) {
        if(!isNaN(mount) && mount === count) {
            break;
        }

        if(from[i].value === val) {
            to.push(from.splice(i, 1)[0]);
            count++;
        }
    }
};

/**
 * 根据手牌分析评分来叫分
 * @return {int} 对评分/2向上取整
 */
AI.prototype.getCardsRating = function() {
    var self = this,
        score = self.cardAnalysis.getRatingScore(),
        result = G.game.math.ceilTo(score / 2);

    if(result > 3) {
        result = 3;
    } else if(result < 0) {
        result = 0;
    }

    return result;
}

/**
 * [playCard description]
 * @return {CardType} [description]
 */
AI.prototype.playCard = function() {
    var self = this;

    if(self.cards.length === 20) { // 第一张
        return self.cardAnalysis.getFirstCards();

    } else {

    }
};

/**
 * [followCard description]
 * @return {[type]} [description]
 */
AI.prototype.followCard = function() {
    var self = this;

    console.info('------跟牌------');
};
