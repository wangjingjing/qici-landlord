/**
 * 维护一副牌
 */
var CardManager = qc.landlord.CardManager = function() {
    // 存储一副牌
    this.rawCards = [];
};
CardManager.prototype = {};
CardManager.prototype.constructor = CardManager;

/**
 * 初始化本模块
 */
CardManager.prototype.init = function() {
    var self = this;
    
    var data = G.game.assets.find('config').findSheet('poker');
    
    data.rows.forEach(function(row) {
        var card = new qc.landlord.Card();
        card.id = row.id;
        card.name = row.name;
        card.icon = row.icon;
        card.type = row.type;
        card.value = row.value;

        self.rawCards[card.id] = card;
    });
};

CardManager.prototype.getNewPackOfCards = function() {
    return this.rawCards.slice(0);
};

CardManager.prototype.getOneCard = function(cards) {
    // 随机删除数组中的一个元素并将其返回
    return cards.splice(G.game.math.random(0, cards.length - 1) ,1)[0];
    // var index = G.game.math.random(0, cards.length - 1);
    // G.game.log.trace('Random Index: {0}', index);
    // var card = cards.splice(index ,1)[0];
    // G.game.log.trace('Random One Card: {0}', card.name);
    // return card;
};

/**
 * 牌排序时用的比较函数
 * 牌值大的排在前面，牌值相同时花色值小的排在前面
 * 
 * @param  {Card} a 
 * @param  {Card} b 
 * @return 牌值小或花色值大，返回1；反之，返回-1
 */
CardManager.prototype.compare = function(a, b){
	// var va = parseInt(a.val, 10);
	// var vb = parseInt(b.val, 10);
    var va = a.value,
        vb = b.value;
    
    if(va === vb){
        return a.type > b.type ? 1 : -1;
    } else if(va < vb){
        return 1;
    } else {
        return -1;
    }
};

/**
 * 如果card比数组中第一个小，则返回0；
 * 如果card比数组中最后一个大，则返回数组长度；
 * 否则返回card在有序数组中应插入的位置
 * 
 * @param  {Array} cards 有序牌数组
 * @param  {Card} card  要插入的牌对象
 * @return {int}       返回牌应该插入有序数组中的位置
 */
CardManager.prototype.getIndex = function(cards, card) {
    var self = this;
    
    var low = 0,
        high = cards.length;
    
    if(high === 0 || self.compare(card, cards[0]) < 0) {
        return 0;
    }
    
    if(self.compare(card, cards[high - 1]) > 0) {
        return high;
    }
    
    while(low <= high) {
        var middle = low + G.game.math.floorTo((high - low) / 2);
        
        if(self.compare(card, cards[middle]) > 0) {
            
            if(self.compare(card, cards[middle + 1]) < 0) {
                return middle + 1;
            }else{
                low = middle + 1;
            }

        }else if(self.compare(card, cards[middle]) < 0){
            if(self.compare(card, cards[middle - 1]) > 0) {
                return middle;
            }else{
                high = middle - 1;
            }

        }else {
            G.game.log.error('Something must be wrong!');
            break;
        }
    }
};

