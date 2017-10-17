/**
 * 牌类，负责维护牌的信息
 */
var Card = qc.landlord.Card = function() {
    var self = this;

    /**
     * @property {number} id - 牌标识
     */
    self.id = 0;

    /**
     * @property {string} name - 牌名
     */
    self.name = '';

    /**
     * @property {string} icon - 牌图标
     */
    self.icon = '';

    /**
     * @property {number} type - 牌类型
     */
    self.type = -1;
    
    /**
     * @property {number} value - 牌值
     */
    self.value = 0;
};
Card.prototype = {};
Card.prototype.constructor = Card;

/***
 * 复制出一张牌
 */
Card.prototype.clone = function() {
    var c = new Card();
    c.id = this.id;
    c.name = this.name;
    c.icon = this.icon;
    c.type = this.type;
    c.value = this.value;
};

Card.prototype.toString = function() {
    return this.name + '(' + this.value + ')';
};
