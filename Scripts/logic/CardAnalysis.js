/**
 * 牌型分析结果
 */
var CardAnalysis = qc.landlord.CardAnalysis = function(){
    var self = this;

    self.jokerBomb = [];
    self.bomb = [];
    self.plane = [];
    self.triple = [];
    self.straight = [];
    self.doubleStraight = [];
    self.pair = [];
    self.single = [];

    self.two = [];
    self.blackJoker = [];
    self.joker = [];
};

/**
 * 王炸    加 5 分
 * 炸弹（不是四个2）每个加 4 分
 * 飞机每个加1分
 * 三张J及以上每个加 1 分（不是二）
 * 连对长度8张及以上每个加 1 分
 * 顺子长度值和牌值的和大于18的每个加1分
 * A以下的单牌数加K以下的对牌数与三张牌（包括飞机）的数量差，差为正数则扣分
 * 二每个  加 1 分（不是炸弹）
 * 小王    加 2 分（没有王炸）
 * 大王    加 3 分（没有王炸）
 * @return {int} [description]
 */
CardAnalysis.prototype.getRatingScore = function() {
    var self = this,
        score = 0;

    if(self.jokerBomb.length === 1) {
        score += 5;
    } else {
        if(self.joker.length === 1) {
            score += 3;
        }
        if(self.blackJoker.length === 1) {
            score += 2;
        }
    }

    score += self.two.length;

    for(var i in self.bomb) {
        if(self.bomb[i].value !== 15) {
            score += 4;
        }
    }

    // for(var i in self.plane) {
    //     score += self.plane[i].size / 3;
    // }
    score += self.plane.length;

    for(var i in self.triple) {
        if(self.triple[i].value >= 11 && self.triple[i].value !== 15) {
            score += 1;
        }
    }

    for(var i in self.doubleStraight) {
        if(self.doubleStraight[i].size > 7) {
            score += 1;
        }
    }

    for(var i in self.straight) {
        if(self.straight[i].size + self.straight[i].value > 18) {
            score += 1
        }
    }

    if(self.countSmallCards() > 0) {
        score -= self.countSmallCards();
    }

    return score;
};

/**
 * 计算小单牌和小对牌与三张牌（包括飞机）的数量差
 * @return {int} [description]
 */
CardAnalysis.prototype.countSmallCards = function() {
    var self = this,
        count = 0;

    count += self.countSmallSingle();
    count += self.countSmallPair();
    count -= self.triple.length;

    for(var i in self.plane) {
        count -= self.plane[i].size / 3;
    }

    // console.info('小单+小对-三张-飞机长/3：' + count);
    return count;
};

/**
 * 计算小于A（包含A）的单牌个数
 * @return {int} [description]
 */
CardAnalysis.prototype.countSmallSingle = function() {
    var self = this,
        count = 0;

    for(var i in self.single) {
        if(self.single[i].value <= 14) {
            count += 1;
        }
    }

    return count;
};

/**
 * 计算小于K（包含K）的对牌个数
 * @return {[type]} [description]
 */
CardAnalysis.prototype.countSmallPair = function() {
    var self = this,
        count = 0;

    for(var i in self.pair) {
        if(self.pair[i].value <= 13) {
            count += 1;
        }
    }

    return count;
};

/**
 * 地主出的第一手牌
 * 
 * 统计手中不能被三张牌带出的小单牌和小对牌的数量，
 * 如果少于1则出手中最下的飞机、连对、三张或顺子，
 * 否则除最小的单牌或对牌
 * 
 * @return {CardType} [description]
 */
CardAnalysis.prototype.getFirstCards = function() {
    var self = this;

    if(self.countSmallCards() <= 1) {

        if(self.plane.length > 0 && self.doubleStraight.length > 0) {
            // 如果既有飞机又有连对，则出较长的那个
            
            var planeSize = self.plane[0].size / 3;
            var doubleStraightSize = self.doubleStraight[0].size / 2;

            if(planeSize + 1 >= doubleStraightSize) {
                return self.minPlaneCards();
            } else {
                return self.doubleStraight[0];
            }
        } else {
            if(self.plane.length > 0) {
                return self.minPlaneCards();

            } else if(self.doubleStraight.length > 0) {
                return self.doubleStraight[0];

            } else if(self.triple.length > 0){
                return self.minTripleCards();

            } else if(self.straight.length > 0) {
                return self.straight[0];
            }
        }
    }

    var result = null;

    if(self.single.length > 0) {
        result = self.single[0];
    }

    if(self.pair.length > 0 &&
        (result === null || result.value > self.pair[0].value)) {
        result = self.pair[0];
    }

    return result;
};

/**
 * 牌值最小的飞机
 *
 * 根据小单牌和小对牌数决定飞机的牌型，
 * 是飞机、飞机带单还是飞机带对
 * @return {CardType} [description]
 */
CardAnalysis.prototype.minPlaneCards = function() {
    var self = this,
        planeCards = self.plane[0].cards,
        tripleNum = planeCards.length / 3,
        singleCount = self.countSmallSingle(),
        pairCount = self.countSmallPair();

    var getPlaneCards = function(smallCount, concatCards, enumCardType) {

        if(smallCount < tripleNum) {
            tripleNum = smallCount;
            planeCards = planeCards.slice(planeCards.length - tripleNum * 3);
        }

        for(var i = 0; i < tripleNum; i++) {
            planeCards = planeCards.concat(concatCards[i].cards);
        }

        return new qc.landlord.CardType(enumCardType, planeCards[0].value, planeCards);
    };

    if(singleCount <= 1 && pairCount === 0) { 
        // 小单牌数不大于1同时小对牌数为0，则不带牌
        return new qc.landlord.CardType(
            G.gameRule.PLANE, planeCards[0].value, planeCards);

    } else if(singleCount <= 1 && pairCount === 1) {
        // 小对牌数为2，同时小单牌数不必小对牌数多，
        // 则将小对拆为两个单牌带出

        var singles = [];
        for(var i in self.pair[0].cards) {
            var singleType = new qc.landlord.CardType(
                G.gameRule.SINGLE, self.pair[0].cards[i].value, [self.pair[0].cards[i]]);
            singles.push(singleType);
        }
        return getPlaneCards(2, singles, G.gameRule.PLANE_PLUS_SINGLE);

    } else if(singleCount > pairCount) {
        return getPlaneCards(singleCount, self.single, G.gameRule.PLANE_PLUS_SINGLE);

    } else if(pairCount > singleCount) {
        return getPlaneCards(pairCount, self.pair, G.gameRule.PLANE_PLUS_PAIR);

    } else { // 小单牌数与小对牌数相同，且都不小于2
        var sumSinglVal = 0;
        for(var i = 0; i < singleCount; i++) {
            sumSinglVal += self.single[i].value;
        }

        var sumPairVal = 0;
        for(var i = 0; i < pairCount; i++) {
            sumPairVal += self.pair[i].value;
        }

        if(sumSinglVal <= sumPairVal) {
            return getPlaneCards(singleCount, self.single, G.gameRule.PLANE_PLUS_SINGLE);
        } else {
            return getPlaneCards(pairCount, self.pair, G.gameRule.PLANE_PLUS_PAIR);
        }
    }
};

/**
 * 牌值最小的三张
 *
 * 根据小单牌和小对牌的数量决定三张的牌型，
 * 是三张、三带一还是三带对
 * @return {CardType} [description]
 */
CardAnalysis.prototype.minTripleCards = function() {
    var self = this,
        tripleCards = self.triple[0].cards,
        singleCount = self.countSmallSingle(),
        pairCount = self.countSmallPair();

    if(singleCount === 0 && pairCount === 0) {
        return new qc.landlord.CardType(
            G.gameRule.TRIPLE, tripleCards[0].value, tripleCards);
        
    } else if(singleCount > pairCount) {
        tripleCards = tripleCards.concat(self.single[0].cards);
        return new qc.landlord.CardType(
            G.gameRule.TRIPLE_PLUS_SINGLE, tripleCards[0].value, tripleCards);

    } else if(pairCount > singleCount) {
        tripleCards = tripleCards.concat(self.pair[0].cards);
        return new qc.landlord.CardType(
            G.gameRule.TRIPLE_PLUS_PAIR, tripleCards[0].value, tripleCards);

    } else {
        if(self.single[0].value < self.pair[0].value) {
            tripleCards = tripleCards.concat(self.single[0].cards);
            return new qc.landlord.CardType(
                G.gameRule.TRIPLE_PLUS_SINGLE, tripleCards[0].value, tripleCards);
        } else {
            tripleCards = tripleCards.concat(self.pair[0].cards);
            return new qc.landlord.CardType(
                G.gameRule.TRIPLE_PLUS_PAIR, tripleCards[0].value, tripleCards);
        }
    }
};
