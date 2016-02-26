Template.openchannels.onCreated(function() {
	this.subscribe('latestChannels');
});

Template.openchannels.helpers({
	channels: function() {
		console.log("hi");
		console.log(Channel.getLatest().fetch());
    return Channel.getLatest().fetch();
  }

});

Template.openchannels.events({
    'click': function(err, res){
    	console.log(this);
        FlowRouter.go(`/channels/${this._id}`);
    }
});
