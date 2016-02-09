Template.home.onCreated(function() {
  this.subscribe('latestChannels');
});

Template.home.helpers({
  channels: function() {
    return Channel.getLatest().fetch();
  }
});

Template.subscribeButton.helpers({
  subscribed: function() {
    if(Meteor.user()) {
      return User.me().isSubscribedTo(this);
    }
    return false;
  }
});

Template.subscribeButton.events({
  'click button#subscribe': function(e, tmpl) {
    e.preventDefault();
    Meteor.call('/users/subscribe', this);
  },
  'click button#unsubscribe': function(e, tmpl) {
    e.preventDefault();
    Meteor.call('/users/unsubscribe', this);
  }
});
