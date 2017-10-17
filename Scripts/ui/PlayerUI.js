// define a user behaviour
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
