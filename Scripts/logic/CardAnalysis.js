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
 * 炸弹每个加 4 分
 * 飞机按（长度/3）加分
 * 三张10及以上每个加 1 分（不是二）
 * 连对每个加 1 分
 * 对10及以下每个减 1 分，对A加 1 分
 * 单Q及以下每个减 1 分
 * 二每个  加 1 分（不是炸弹）
 * 小王    加 2 分（没有王炸）
 * 大王    加 3 分（没有王炸）
 * @return {[type]} [description]
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

    for(var i in self.bomb) {
        if(self.bomb[i].value !== 15) {
            score += 4;
        }
    }

    for(var i in self.plane) {
        score += self.plane[i].size / 3;
    }

    for(var i in self.triple) {
        if(self.triple[i].value >= 10 && self.triple[i].value !== 15) {
            score += 1;
        }
    }

    score += self.doubleStraight.length;

    for(var i in self.pair) {
        if(self.pair[i].value <= 10) {
            score -= 1;
        } else if(self.pair[i].value === 14) {
            score += 1;
        }
    }

    for(var i in self.single) {
        if(self.single[i].value <= 12) {
            score -= 1;
        }
    }

    score += self.two.length;

    return score;
};
