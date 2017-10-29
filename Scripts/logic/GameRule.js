/**
 * 规则类，用于判断牌型等
 */
var GameRule = qc.landlord.GameRule = function() {

};
/**
 * 牌型枚举
 */
GameRule.prototype.SINGLE = 1;
GameRule.prototype.PAIR = 2;
GameRule.prototype.TRIPLE = 3;
GameRule.prototype.TRIPLE_PLUS_SINGLE = 4;
GameRule.prototype.TRIPLE_PLUS_PAIR = 5;
GameRule.prototype.STRAIGHT = 6;
GameRule.prototype.DOUBLE_STRAIGHT = 7;
GameRule.prototype.PLANE = 8;
GameRule.prototype.PLANE_PLUS_SINGLE = 9;
GameRule.prototype.PLANE_PLUS_PAIR = 10;
GameRule.prototype.FOUR_PLUS_TWO_SINGLE = 11;
GameRule.prototype.FOUR_PLUS_TWO_PAIR = 12;
GameRule.prototype.BOMB = 13;
GameRule.prototype.JOKER_BOMB = 14;

/**
 * 判断合理牌型
 * @param  {Array} cards [description]
 * @return {CardType}       [description]
 */
GameRule.prototype.judgeCardType = function(cards) {
    var self = this,
        len = cards.length;

    switch(len) {
        case 1 :
            return new qc.landlord.CardType(self.SINGLE, cards[0].value, cards);

        case 2 :
            if(self.isPair(cards)) {
                return new qc.landlord.CardType(self.PAIR, cards[0].value, cards);
            } else if(self.isJokerBomb(cards)) {
                return new qc.landlord.CardType(self.JOKER_BOMB, cards[0].value, cards);
            }
            return;

        case 3 :
            if(self.isTriple(cards)) {
                return new qc.landlord.CardType(self.TRIPLE, cards[0].value, cards);
            }
            return;

        case 4 :
            if(self.isTriplePlusSingle((cards))) {
                return new qc.landlord.CardType(self.TRIPLE_PLUS_SINGLE,
                    self.getMaxValue(cards, 3), cards);
            } else if(self.isBomb(cards)) {
                return new qc.landlord.CardType(self.BOMB, cards[0].value, cards);
            }
            return;

        default :
            if(self.isTriplePlusPair(cards)) {
                return new qc.landlord.CardType(self.TRIPLE_PLUS_PAIR,
                    self.getMaxValue(cards, 3), cards);
            } else if(self.isStraight(cards)) {
                return new qc.landlord.CardType(self.STRAIGHT,
                    cards[0].value, cards);
            } else if(self.isDoubleStraight(cards)) {
                return new qc.landlord.CardType(self.DOUBLE_STRAIGHT,
                    cards[0].value, cards);
            } else if(self.isPlane(cards)) {
                return new qc.landlord.CardType(self.PLANE,
                    cards[0].value, cards);
            } else if(self.isPlanePlusSingle(cards)) {
                return new qc.landlord.CardType(self.PLANE_PLUS_SINGLE,
                    self.getMaxValue(cards, 3), cards);
            } else if(self.isPlanePlusPair(cards)) {
                return new qc.landlord.CardType(self.PLANE_PLUS_PAIR,
                    self.getMaxValue(cards, 3), cards);
            } else if(self.isFourPlusTwoSingle(cards)) {
                return new qc.landlord.CardType(self.FOUR_PLUS_TWO_SINGLE,
                    self.getMaxValue(cards, 4), cards);
            } else if(self.isFourPlusTwoPair(cards)) {
                return new qc.landlord.CardType(self.FOUR_PLUS_TWO_PAIR, 
                    self.getMaxValue(cards, 4), cards);
            }
            return;
    }
};

/**
 * 是否是对
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isPair = function(cards) {
    return cards.length === 2 && cards[0].value === cards[1].value;
};

/**
 * 是否是三张
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isTriple = function(cards) {
    return cards.length === 3 && (cards[0].value === cards[1].value
        && cards[1].value === cards[2].value);
};

/**
 * 是否是三带一
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isTriplePlusSingle = function(cards) {
    if(cards.length !== 4) {
        return false;
    }
    var vc = this.countValues(cards);
    return vc.length === 2 && (vc[0].count === 3 || vc[1].count === 3);
};

/**
 * 是否是三带一对
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isTriplePlusPair = function(cards) {
    if(cards.length !== 5) {
        return false;
    }
    var vc = this.countValues(cards);
    return vc.length === 2 && (vc[0].count === 3 || vc[1].count === 3);
};

/**
 * 是否是顺子
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isStraight = function(cards) {
    if(cards.length < 5 || cards[0].value > 14) {
        return false;
    }
    for(var i = 0; i < cards.length - 1; i++) {
        if(cards[i].value - 1 !== cards[i + 1].value) {
            return false;
        }
    }
    return true;
};

/**
 * 是否是连对
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isDoubleStraight = function(cards) {
    if(cards.length < 6 || cards.length % 2 !== 0 || cards[0].value > 14) {
        return false;
    }
    for(var i = 0; i < cards.length - 2; i += 2) {
        if(cards[i].value !== cards[i + 1].value
            || cards[i].value - 1 !== cards[i + 2].value) {
            return false;
        }
    }
    return true;
};

/**
 * 是否是飞机
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isPlane = function(cards) {
    if(cards.length < 6 || cards.length % 3 !== 0 || cards[0].value >= 15) {
        return false;
    }
    for(var i = 0; i < cards.length - 3; i += 3) {
        if(cards[i].value !== cards[i + 1].value
            || cards[i + 1].value !== cards[i + 2].value
            || cards[i].value - 1 !== cards[i + 3].value) {
            return false;
        }
    }
    return true;
};

/**
 * 飞机带单
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isPlanePlusSingle = function(cards) {};

/**
 * 飞机带对
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isPlanePlusPair = function(cards) {};

/**
 * 是否是四带二
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isFourPlusTwoSingle = function(cards) {
    if(cards.length !== 6) {
        return false;
    }
    var vc = this.countValues(cards);
    for(var i in vc) {
        if(i.count === 4) {
            return true;
        }
    }
    return false;
};

/**
 * 四带两对
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isFourPlusTwoPair = function(cards) {
    if(cards.length !== 8) {
        return false;
    }
    var vc = this.countValues(cards);
    for(var i in vc) {
        if(i.count !== 4 && i.count !== 2) {
            return false;
        }
    }
    return true;
};

/**
 * 是否是炸弹
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isBomb = function(cards) {
    return cards.length === 4 && (cards[0].value === cards[1].value
        && cards[1].value === cards[2].value && cards[2].value === cards[3].value);
};

/**
 * 是否是王炸
 * @param  {Array}  cards [description]
 * @return {Boolean}       [description]
 */
GameRule.prototype.isJokerBomb = function(cards) {
    return cards.length === 2 && cards[0].type === 0 && cards[1].type === 0;
};

/**
 * 统计牌中各牌值的牌数
 * @param  {Array} cards 待统计的牌
 * @return {Array}       [{value:牌值, count:牌数}]
 */
GameRule.prototype.countValues = function(cards) {

    var addCount = function(result , val){
        for (var i = 0; i < result.length; i++) {
            if(result[i].value === val){
                result[i].count ++;
                return;
            }
        }
        result.push({'value': val, 'count': 1});
    };

    var result = [];
    for (var i in cards){
        addCount(result, cards[i].value);
    }
    return result;
};

/**
 * 获取cards中指定数目的相同牌值中最大的值
 * @param  {Array} cards [description]
 * @param  {int} len   相同大小的牌的数量
 * @return {int}       最大牌值
 */
GameRule.prototype.getMaxValue = function(cards, len) {
    var max = 0,
        vc = this.countValues(cards);

    for(var i in vc) {
        if(i.count === len && i.value > max) {
            max = i.value;
        }
    }
    return max;
};
