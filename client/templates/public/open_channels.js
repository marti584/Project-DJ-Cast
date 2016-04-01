Template.openchannels.onCreated(function() {
	this.subscribe('latestChannels');
});

Template.openchannels.helpers({
	channels: function() {
        return Channel.getLatest().fetch();
  }, 
  isModerator: function() {
    var channelId = this._id;
    if (Channel.findOne(channelId))
        return User.me()._id == Channel.findOne(channelId).creator;
    else
        return false;
  }

});

Template.openchannels.events({
    'click button': function(e, tmpl) {
        e.stopPropagation();
        var channel = Channel.findOne(this._id);
        Meteor.call('/channels/end', channel, function(err, res) {
            
        });
    },
    'click li': function(e, tmpl){
        FlowRouter.go(`/channels/${this._id}`);
    }
});
