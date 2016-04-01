Template.home.onCreated(function() {
  this.subscribe('latestChannels');
});

Template.home.helpers({
  channels: function() {
    return Channel.getLatest().fetch();
  },
  addDisabled: function() {
    if (!Meteor.user()) {
      return 'disabled';
    }
  }
});

Template.home.events({

  'change input': function(e, tmpl) {
    e.preventDefault();

    var field = e.currentTarget;
    tmpl.data.channel.set(field.id, field.value);
  },

  'submit form': function(e, tmpl) {
    e.preventDefault();

    if (tmpl.data.channel.validate()) {
      Meteor.call('/channels/new', tmpl.data.channel, function(err, res) {
        if (err) tmpl.data.channel.catchValidationException();
        document.body.className = "";
        $('.modal-backdrop').remove();
        FlowRouter.go(`/channels/${res._id}`);
      });
    }
  },

  "click button": function (e, template) {
    if (e.target.id == "largeCreate") {
      template.data.channel = new Channel();
    } else if (e.target.id == "joinRoom") {
      FlowRouter.go('/channels');
    } 
  }

});
