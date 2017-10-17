// define a user behaviour
var CardUI = qc.defineBehaviour('qc.landlord.CardUI', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
//CardUI.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//CardUI.prototype.update = function() {
//
//};

/**
  * 显示纸牌，
  * @property card 卡牌信息，
  */
CardUI.prototype.show = function(card){
    var self = this,
        o = self.gameObject;

    o.frame = card.icon;
    o.resetNativeSize();
    //o.visible = true;
};

/**
  * 选中纸牌，纸牌上移
  */
CardUI.prototype.onClick = function (){
    var self = this;

    if(self.isSelected){
        this.gameObject.anchoredY = 0;
    } else {
        this.gameObject.anchoredY = -28;
    }

    self.isSelected = !self.isSelected;

    var ui = window.landlordUI ? window.landlordUI : window.olLandlordUI;
    if(ui.getReadyCardsKind()){
        ui.playBtn.state = qc.UIState.NORMAL;
    } else {
        ui.playBtn.state = qc.UIState.DISABLED;
    }
};
