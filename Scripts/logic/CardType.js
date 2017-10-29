/**
 * 牌型类型，如炸弹、顺子、单张等
 *
 * @param {int} type   GameRule中的牌型枚举值
 * @param {int} value  牌值
 * @param {Array[Card]} cards 牌
 */
var CardType = qc.landlord.CardType = function(type, value, cards){
    var self = this;

    // 牌型
    self.type = type;

    self.value = value;

    self.cards = cards;

    self.size = cards.length;
};
