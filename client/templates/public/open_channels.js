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
    'click': function(){
        Meteor.Router.to("/openchannels");
    }
});
