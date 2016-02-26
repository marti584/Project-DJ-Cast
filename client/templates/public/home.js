Template.home.onCreated(function() {
  this.subscribe('latestChannels');
});

Template.home.helpers({
  channels: function() {
    return Channel.getLatest().fetch();
  },
  addDisabled: function() {
    if (!Meteor.user()) {
      console.log("No user");
      return 'disabled';
    }
    console.log("User");
  }
});

Template.home.events({
  "click button": function (e, template) {
    if (e.target.id == "joinRoom") {
      console.log("Join room button");
      FlowRouter.route('/openchannels');

    } 
  }
});