Template.openchannels.onCreated(function() {
	this.subscribe('latestChannels');
});

Template.openchannels.helpers({
	channels: function() {
    return Channel.getLatest().fetch();
  }

});

Template.openchannels.events({
    'click': function(err, res){
        FlowRouter.go(`/channels/${this._id}`);
    }
});
