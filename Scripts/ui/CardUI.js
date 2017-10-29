/**
 * 纸牌UI，处理牌的显示、点击等
 */
var CardUI = qc.defineBehaviour('qc.landlord.CardUI', qc.Behaviour, function() {
    this.isSelected = false;
    this.cardObj = null;
}, {
    // fields need to be serialized
});

 /**
  * 显示纸牌
  * 
  * @param  {Card} card [description]
  * @return {[type]}      [description]
  */
CardUI.prototype.show = function(card){
    var self = this,
        o = self.gameObject;

    o.frame = card.icon;
    o.resetNativeSize();
    self.cardObj = card;
};

/**
 * 选中纸牌，纸牌上移
 * 
 * @return {[type]} [description]
 */
CardUI.prototype.onClick = function (){
    var self = this;

    if(self.isSelected){
        this.gameObject.anchoredY = 0;
    } else {
        this.gameObject.anchoredY = -28;
    }

    self.isSelected = !self.isSelected;

    var ui = window.singleUI ? window.singleUI : window.onlineUI;
    if(ui.getSelectedCardsType()){
        ui.playBtn.state = qc.UIState.NORMAL;
    } else {
        ui.playBtn.state = qc.UIState.DISABLED;
    }
};
