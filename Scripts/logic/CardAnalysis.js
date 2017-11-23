/**
 * 牌型分析结果
 */
var CardAnalysis = qc.landlord.CardAnalysis = function(){
    var self = this;
    self.handCards = [];

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

            } else if(self.triple.length > 0 && self.triple[0].value != 15){
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
            Array.prototype.push.apply(planeCards, concatCards[i].cards);
        }

        return new qc.landlord.CardType(enumCardType, planeCards[0].value, planeCards);
    };

    // 保存长度大于5的顺子位置在5后面的小牌
    var redundantSingleCards = [];
    for(var i in self.straight) {
        var straightCards = self.straight[i].cards;
        if(straightCards.length > 5) {
            for(var j = 5; j < straightCards.length; j++) {
                // 将大于5的部分切分为单牌
                var singleType = new qc.landlord.CardType(
                    G.gameRule.SINGLE, self.straightCards[j].value, [self.straightCards[j]]);
                redundantSingleCards.push(singleType);
            }
        }
    }
    redundantSingleCards.sort(G.cardManager.compare);
    redundantSingleCards.reverse();

    // 保存长度大于6的连对位置在6后面的小牌
    var redundantPairCards = [];
    for(var i in self.doubleStraight) {
        var doubleStraightCards = self.doubleStraight[i].cards;
        if(doubleStraightCards.length > 6) {
            for(var j = 7; j < doubleStraightCards.length; j+=2) {
                // 将大于6的部分每两张切分为一个对牌
                var pairType = new qc.landlord.CardType(G.gameRule.PAIR,
                    self.doubleStraightCards[j].value,
                    [self.doubleStraightCards[j], self.doubleStraightCards[j-1]]);
                redundantPairCards.push(pairType);
            }
        }
    }
    redundantPairCards.sort(G.cardManager.compare);
    redundantPairCards.reverse();

    if(singleCount == 0 && pairCount === 0) {
        // 小单牌数和小对牌数都为0，则不带牌
        return new qc.landlord.CardType(
            G.gameRule.PLANE, planeCards[0].value, planeCards);

    } else if(singleCount == 1 && pairCount === 0) {
        // 小单牌数为1同时小对牌数为0，由小单牌和长度大于5的顺子中的小牌给飞机带
        var singles = [self.single[0]];
        Array.prototype.push.apply(singles, redundantSingleCards);

        return getPlaneCards(singles.length, singles, G.gameRule.PLANE_PLUS_SINGLE);

    } else if(singleCount <= 1 && pairCount === 1) {
        // 小对牌数为1，同时小单牌数不比小对牌数多，
        // 则将小对拆为两个单牌带出，
        // 长度大于5的顺子中的小牌也给飞机带

        var singles = [];
        for(var i in self.pair[0].cards) {
            var singleType = new qc.landlord.CardType(
                G.gameRule.SINGLE, self.pair[0].cards[i].value, [self.pair[0].cards[i]]);
            singles.push(singleType);
        }

        if(singleCount === 1) {
            singles.push(self.single[0]);
        }

        Array.prototype.push.apply(singles, redundantSingleCards);

        return getPlaneCards(singles.length, singles, G.gameRule.PLANE_PLUS_SINGLE);

    } else if(singleCount > pairCount) {
        var singles = [];
        for(var i = 0; i < singleCount; i++) {
            singles.push(self.single[i]);
        }
        Array.prototype.push.apply(singles, redundantSingleCards);

        return getPlaneCards(singles.length, singles, G.gameRule.PLANE_PLUS_SINGLE);

    } else if(pairCount > singleCount) {
        var pairs = [];
        for(var i = 0; i < pairCount; i++) {
            pairs.push(self.pair[i]);
        }
        Array.prototype.push.apply(pairs, redundantPairCards);

        return getPlaneCards(pairs.length, pairs, G.gameRule.PLANE_PLUS_PAIR);

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
            var singles = [];
            for(var i = 0; i < singleCount; i++) {
                singles.push(self.single[i]);
            }
            Array.prototype.push.apply(singles, redundantSingleCards);

            return getPlaneCards(singles.length, singles, G.gameRule.PLANE_PLUS_SINGLE);
        } else {
            var pairs = [];
            for(var i = 0; i < pairCount; i++) {
                pairs.push(self.pair[i]);
            }
            Array.prototype.push.apply(pairs, redundantPairCards);

            return getPlaneCards(pairs.length, pairs, G.gameRule.PLANE_PLUS_PAIR);
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
        Array.prototype.push.apply(tripleCards, self.single[0].cards);
        return new qc.landlord.CardType(
            G.gameRule.TRIPLE_PLUS_SINGLE, tripleCards[0].value, tripleCards);

    } else if(pairCount > singleCount) {
        Array.prototype.push.apply(tripleCards, self.pair[0].cards);
        return new qc.landlord.CardType(
            G.gameRule.TRIPLE_PLUS_PAIR, tripleCards[0].value, tripleCards);

    } else {
        if(self.single[0].value < self.pair[0].value) {
            Array.prototype.push.apply(tripleCards, self.single[0].cards);
            return new qc.landlord.CardType(
                G.gameRule.TRIPLE_PLUS_SINGLE, tripleCards[0].value, tripleCards);
        } else {
            Array.prototype.push.apply(tripleCards, self.pair[0].cards);
            return new qc.landlord.CardType(
                G.gameRule.TRIPLE_PLUS_PAIR, tripleCards[0].value, tripleCards);
        }
    }
};

/**
 * 计算手中牌需要几次才能全出净
 * 
 * @return {int} [description]
 */
CardAnalysis.prototype.countHandsOut = function() {
    var self = this;

    /**
     * 取到飞机的牌型
     *
     * 1. 如果单牌数和对牌数都是0，则直接返回纯飞机。
     * 2. 如果对牌数多于单牌数，先计算飞机带对的牌型：
     * 2.1.如果对牌数多于飞机能带牌的数，返回飞机带对；
     * 2.2.否则如果对牌数加连对中对牌数-3的和大于飞机能带牌的数，返回飞机带对；
     * 2.3.否则如果对牌数*2不大于飞机能带牌的数，则将对牌拆为单牌，返回飞机带单；
     * 2.4.否则如果对牌数大于1，则按对牌数截取飞机，返回小飞机带对。
     * 3. 然后再计算飞机带单的牌型：
     * 3.1.如果单牌数多于飞机能带牌的数，返回飞机带单；
     * 3.2.否则根据飞机能带牌的数与单牌数的差，从其他牌型中补牌，
     *     没法补牌时如果单牌数大于1，则按单牌数截取飞机，返回小飞机带单。
     * 4. 以上情况都不满足的，返回纯飞机。
     *
     * @param  {[Card]} planeCards 飞机的牌对象数组
     * @return {CardType}            [description]
     */
    var getPlaneCardType = function(planeCards) {
        console.info('进入getPlaneCardType');

        var plusNum = planeCards.length / 3,
            singleLen = self.single.length,
            pairLen = self.pair.length;

        if(singleLen === 0 && pairLen === 0) {
            return new qc.landlord.CardType(
                G.gameRule.PLANE_PLUS_PAIR, planeCards[0].value, planeCards);
        }

        if(pairLen > singleLen) {

            var maxDoubleStraightLen = 0, // 最长的连对长度
                longestDoubleStraight = null; // 最长的连对牌型对象

            for(var i in self.doubleStraight) {
                if(self.doubleStraight[i].cards.length > maxDoubleStraightLen) {
                    longestDoubleStraight = self.doubleStraight[i];
                    maxDoubleStraightLen = longestDoubleStraight.cards.length;
                }
            }

            if(pairLen >= plusNum) { // 对牌的数量比飞机能带出的多或相等

                for(var i = 0; i < plusNum; i++) {
                    Array.prototype.push.apply(planeCards, self.pair.splice(0, 1)[0].cards);
                }
                return new qc.landlord.CardType(
                    G.gameRule.PLANE_PLUS_PAIR, planeCards[0].value, planeCards);

            } else if(plusNum - pairLen < maxDoubleStraightLen / 2 - 3){ // 连对可退对补充飞机

                addAllPairCard2Plane(planeCards);

                var cutAmount = (plusNum - pairLen) * 2;
                var cutIndex = longestDoubleStraight.size - cutAmount;

                // 将连对中最小的几个对补给飞机
                Array.prototype.push.apply(planeCards,
                    longestDoubleStraight.cards.splice(cutIndex, cutAmount));

                return new qc.landlord.CardType(
                    G.gameRule.PLANE_PLUS_PAIR, planeCards[0].value, planeCards);

            } else if(pairLen * 2 <= plusNum) { // 将全部对牌都按照单牌被飞机带出

                // 按照对牌数量的二倍截断飞机
                var restCards = planeCards.splice(0, planeCards.length - pairLen * 2 * 3);

                if(restCards.length === 3) { // 截断后是三张
                    self.triple.push(new qc.landlord.CardType(G.gameRule.TRIPLE,
                        restCards[0].value, restCards));

                } else { // 截断后还是飞机
                    self.plane.push(new qc.landlord.CardType(G.gameRule.PLANE,
                        restCards[0].value, restCards));
                }

                addAllPairCard2Plane(planeCards);

                return new qc.landlord.CardType(
                    G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

            } else if(pairLen > 1) {

                // 按照对牌的数量截断飞机
                var restCards = planeCards.splice(0, planeCards.length - pairLen * 3);

                if(restCards.length === 3) { // 截断后是三张
                    self.triple.push(new qc.landlord.CardType(G.gameRule.TRIPLE,
                        restCards[0].value, restCards));

                } else { // 截断后还是飞机
                    self.plane.push(new qc.landlord.CardType(G.gameRule.PLANE, 
                        restCards[0].value, restCards));
                }

                addAllPairCard2Plane(planeCards);

                return new qc.landlord.CardType(
                    G.gameRule.PLANE_PLUS_PAIR, planeCards[0].value, planeCards);
            }
        }

        if(singleLen >= plusNum) { // 单牌的数量比飞机能带出的多或相等

            for(var i = 0; i < plusNum; i++) {
                Array.prototype.push.apply(planeCards, self.single.splice(0, 1)[0].cards);
            }
            return new qc.landlord.CardType(
                G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

        } else {
            var absence = plusNum - singleLen, // 飞机能带出的牌数与单牌的数量差
                longestStraight = null, // 最长顺子牌型对象
                maxStraightLen = 0; // 最长的顺子长度

            for(var i in self.straight) {
                if(self.straight[i].cards.length > maxStraightLen) {
                    longestStraight = self.straight[i];
                    maxStraightLen = longestStraight.cards.length;
                }
            }

            switch(absence)
            {
                case 1: // 差一张先从顺子补充，如果没有则拆最小对补充，
                        // 仍然没有则进入default处理
                    if(maxStraightLen - 5 > 0) {
                        addAllSingleCard2Plane(planeCards);

                        // 将最长顺子的最小一张补给飞机
                        Array.prototype.push.apply(planeCards, longestStraight.cards.splice(
                            longestStraight.cards.length - 1, 1));

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

                    } else if(self.pair.length > 0) {
                        addAllSingleCard2Plane(planeCards);

                        // 取到最小的对牌的牌对象数组
                        var minPariCards = self.pair.splice(self.pair.length - 1, 1)[0].cards;

                        // 将对牌拆开，其中给一张牌补给飞机
                        Array.prototype.push.apply(planeCards, minPariCards.splice(0, 1));

                        // 剩一张牌添加到单牌中
                        self.single.push(new qc.landlord.CardType(
                            G.gameRule.SINGLE, minPariCards[0].value, minPariCards));

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);
                    }
                case 2: // 差二张先从对牌补充，如果没有则从顺子补充，
                        // 仍然没有则进入default处理

                    if(self.pair.length > 0) {
                        addAllSingleCard2Plane(planeCards);

                        // 将最小的对牌当作两张单牌补给飞机
                        Array.prototype.push.apply(planeCards,
                            self.pair.splice(self.pair.length - 1, 1)[0].cards);

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

                    } else if(maxStraightLen - 5 > 1) {
                        addAllSingleCard2Plane(planeCards);

                        // 将最长顺子的最小两张补给飞机
                        Array.prototype.push.apply(planeCards, longestStraight.cards.splice(
                            longestStraight.cards.length - 2, 2));

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);
                    }

                case 3: // 差三张先从对牌和顺子补充（一个对和一张顺子长度大于5的单牌）
                        // 如果没有从两个对中拆出三张
                        // 如果还没有则从三张中取一个补充给飞机
                        // 如果仍然没有则从长度大于7的顺子中拆出三张补充给飞机

                    if(self.pair.length > 0) {
                        if(maxStraightLen - 5 > 0) {
                            addAllSingleCard2Plane(planeCards);

                            // 将最长顺子的最小一张补给飞机
                            Array.prototype.push.apply(planeCards, longestStraight.cards.splice(
                                longestStraight.cards.length - 1, 1));

                            // 将最小的对牌当作两张单牌补给飞机
                            Array.prototype.push.apply(planeCards,
                                self.pair.splice(self.pair.length - 1, 1)[0].cards);

                            return new qc.landlord.CardType(
                                G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

                        } else if(self.pair.length > 1) {
                            addAllSingleCard2Plane(planeCards);

                            // 将最小的对牌当作两张单牌补给飞机
                            Array.prototype.push.apply(planeCards,
                                self.pair.splice(self.pair.length - 1, 1)[0].cards);

                            // 再取到最小的对牌的牌对象数组
                            var minPariCards = self.pair.splice(self.pair.length - 1, 1)[0].cards;

                            // 将对牌拆开，其中给一张牌补给飞机
                            Array.prototype.push.apply(planeCards, minPariCards.splice(0, 1));

                            // 剩一张牌添加到单牌中
                            self.single.push(new qc.landlord.CardType(
                                G.gameRule.SINGLE, minPariCards[0].value, minPariCards));

                            return new qc.landlord.CardType(
                                G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);
                        }

                    } else if(self.triple.length > 0) {
                        addAllSingleCard2Plane(planeCards);

                        // 将最小的三张牌型当作三张单牌补给飞机
                        Array.prototype.push.apply(planeCards,
                            self.triple.splice(self.triple.length - 1, 1)[0].cards);

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

                    } else if(maxStraightLen - 5 > 2) {
                        addAllSingleCard2Plane(planeCards);

                        // 将最长顺子的最小三张补给飞机
                        Array.prototype.push.apply(planeCards, longestStraight.cards.splice(
                            longestStraight.cards.length - 3, 3));

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);
                    }

                case 4: //

                    if(self.pair.length > 0) {
                        if(self.pair.length > 1) {
                            addAllSingleCard2Plane(planeCards);

                            // 将最小的两对对牌当作四张单牌补给飞机
                            Array.prototype.push.apply(planeCards,
                                self.pair.splice(self.pair.length - 1, 1)[0].cards);
                            Array.prototype.push.apply(planeCards,
                                self.pair.splice(self.pair.length - 1, 1)[0].cards);

                            return new qc.landlord.CardType(
                                G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

                        } else if(maxStraightLen - 5 > 1) {
                            addAllSingleCard2Plane(planeCards);

                            // 将最长顺子的最小一张补给飞机
                            Array.prototype.push.apply(planeCards, longestStraight.cards.splice(
                                longestStraight.cards.length - 1, 1));

                            // 将最小的对牌当作两张单牌补给飞机
                            Array.prototype.push.apply(planeCards,
                                self.pair.splice(self.pair.length - 1, 1)[0].cards);

                            return new qc.landlord.CardType(
                                G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

                        } else if(self.triple.length > 0) {
                            addAllSingleCard2Plane(planeCards);

                            // 将最小的对牌当作两张单牌补给飞机
                            Array.prototype.push.apply(planeCards,
                                self.pair.splice(self.pair.length - 1, 1)[0].cards);

                            // 再取到最小的对牌的牌对象数组
                            var minTripleCards = self.triple.splice(self.triple.length - 1, 1)[0].cards;

                            // 将三张牌拆开，其中给两张牌补给飞机
                            Array.prototype.push.apply(planeCards, minTripleCards.splice(0, 2));

                            // 剩一张牌添加到单牌中
                            self.single.push(new qc.landlord.CardType(
                                G.gameRule.SINGLE, minTripleCards[0].value, minTripleCards));

                            return new qc.landlord.CardType(
                                G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);
                        }

                    } else if(self.triple.length > 0) {
                        console.error('不可能进来1');

                        if(maxStraightLen - 5 > 0) {
                            addAllSingleCard2Plane(planeCards);

                            // 将最长顺子的最小一张补给飞机
                            Array.prototype.push.apply(planeCards, longestStraight.cards.splice(
                                longestStraight.cards.length - 1, 1));

                            // 将最小的三张牌型当作三张单牌补给飞机
                            Array.prototype.push.apply(planeCards,
                                self.triple.splice(self.triple.length - 1, 1)[0].cards);

                            return new qc.landlord.CardType(
                                G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);

                        }

                    } else if(maxStraightLen - 5 > 3) {
                        console.error('不可能进来2');

                        addAllSingleCard2Plane(planeCards);

                        // 将最长顺子的最小四张补给飞机
                        Array.prototype.push.apply(planeCards, longestStraight.cards.splice(
                            longestStraight.cards.length - 4, 4));

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);
                    }

                default:
                    if(singleLen > 1) {
                        // 按照单牌的数量截断飞机
                        var restCards = planeCards.splice(0, planeCards.length - singleLen * 3);

                        if(restCards.length === 3) { // 截断后是三张
                            self.triple.push(new qc.landlord.CardType(G.gameRule.TRIPLE,
                                restCards[0].value, restCards));

                        } else { // 截断后还是飞机
                            self.plane.push(new qc.landlord.CardType(G.gameRule.PLANE,
                                restCards[0].value, restCards));
                        }

                        for(var i in self.single) {
                            Array.prototype.push.apply(planeCards, self.single[i].cards);
                        }
                        self.single = [];

                        return new qc.landlord.CardType(
                            G.gameRule.PLANE_PLUS_SINGLE, planeCards[0].value, planeCards);
                    }
            }

            return new qc.landlord.CardType(G.gameRule.PLANE, planeCards[0].value, planeCards);
        }
    };

    var addAllSingleCard2Plane = function(planeCards) {
        for(var i in self.single) {
            Array.prototype.push.apply(planeCards, self.single[i].cards);
        }
        self.single = [];
    };

    var addAllPairCard2Plane = function(planeCards) {
        for(var i in self.pair) {
            Array.prototype.push.apply(planeCards, self.pair[i].cards);
        }
        self.pair = [];
    };

    var getTripleCardType = function(tripleCards) {

        console.info('进入getTripleCardType');
        if(self.single.length === 0 && self.pair.length === 0) {
            return new qc.landlord.CardType(
                G.gameRule.TRIPLE, tripleCards[0].value, tripleCards);
        }

        if(self.single.length > 0) {
            Array.prototype.push.apply(tripleCards, self.single.splice(0, 1)[0].cards);
            return new qc.landlord.CardType(
                G.gameRule.TRIPLE_PLUS_SINGLE, tripleCards[0].value, tripleCards);

        } else {
            Array.prototype.push.apply(tripleCards, self.pair.splice(0, 1)[0].cards);
            return new qc.landlord.CardType(
                G.gameRule.TRIPLE_PLUS_PAIR, tripleCards[0].value, tripleCards);
        }
    };

    var getBombCardType = function(bombCards) {
        console.info('进入getBombCardType');

        var singleLen = self.single.length,
            pairLen = self.pair.length;

        if(singleLen === 0 && pairLen === 0) {
            return new qc.landlord.CardType(
                G.gameRule.BOMB, bombCards[0].value, bombCards);
        }

        if(singleLen === 1 && pairLen === 0) {
            var longestStraight = null, // 最长顺子牌型对象
                maxStraightLen = 0; // 最长的顺子长度

            for(var i in self.straight) {
                if(self.straight[i].cards.length > maxStraightLen) {
                    longestStraight = self.straight[i];
                    maxStraightLen = longestStraight.cards.length;
                }
            }

            if(maxStraightLen > 5) {
                Array.prototype.push.apply(bombCards,
                    longestStraight.cards.splice(maxStraightLen - 1, 1));
                bombCards.push(self.single[0]);
                self.single = [];

                return new qc.landlord.CardType(
                    G.gameRule.FOUR_PLUS_TWO_SINGLE, bombCards[0].value, bombCards);
            } else {
                return new qc.landlord.CardType(
                    G.gameRule.BOMB, bombCards[0].value, bombCards);
            }

        } else if(singleLen <= 1 && pairLen === 1) { // 将对牌当作两张单牌给四张带出
            Array.prototype.push.apply(bombCards, self.pair[0].cards);

            return new qc.landlord.CardType(
                    G.gameRule.FOUR_PLUS_TWO_SINGLE, bombCards[0].value, bombCards);

        } else { // 单牌和对牌数都多于1张

            // 计算最小的两张单牌值的和
            var sumTwoSinglVal = self.single[0].value + self.single[1].value;

            // 计算最小的两张对牌值的和
            var sumTwoPairVal = self.pair[0].value + self.pair[1].value;

            if(sumSinglVal <= sumPairVal) {
                Array.prototype.push.apply(bombCards, self.single[0].cards);
                Array.prototype.push.apply(bombCards, self.single[1].cards);

                return new qc.landlord.CardType(
                    G.gameRule.FOUR_PLUS_TWO_SINGLE, bombCards[0].value, bombCards);

            } else {
                Array.prototype.push.apply(bombCards, self.single[0].cards);
                Array.prototype.push.apply(bombCards, self.single[1].cards);

                return new qc.landlord.CardType(
                    G.gameRule.FOUR_PLUS_TWO_PAIR, bombCards[0].value, bombCards);
            }
        }
    };

    Array.prototype.push.apply(self.handCards, self.jokerBomb);

    while(self.plane.length > 0) {
        var planeCards = self.plane.splice(0, 1)[0].cards;
        self.handCards.push(getPlaneCardType(planeCards));
    }

    while(self.triple.length > 0) {
        var tripleCards = self.triple.splice(0, 1)[0].cards;
        self.handCards.push(getTripleCardType(tripleCards));
    }

    while(self.bomb.length > 0) {
        var bombCards = self.bomb.splice(0, 1)[0].cards;
        self.handCards.push(getBombCardType(bombCards));
    }

    Array.prototype.push.apply(self.handCards, self.doubleStraight);
    Array.prototype.push.apply(self.handCards, self.straight);
    Array.prototype.push.apply(self.handCards, self.pair);
    Array.prototype.push.apply(self.handCards, self.single);

    return self.handCards.length;
};
