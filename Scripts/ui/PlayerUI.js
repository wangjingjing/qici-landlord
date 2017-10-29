/**
 * 玩家UI，处理头像
 */
var PlayerUI = qc.defineBehaviour('qc.landlord.PlayerUI', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
    header : qc.Serializer.NODE,
    score : qc.Serializer.NODE,
    cardList : qc.Serializer.NODE
});

// Called when the script instance is being loaded.
//PlayerUI.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//PlayerUI.prototype.update = function() {
//
//};

PlayerUI.prototype.setHeaderPic = function(isLandlord) {
    var self = this;

    self.header.frame = isLandlord ? 'landlord.png' : 'peasant.png';
    self.header.visible = true;
};
