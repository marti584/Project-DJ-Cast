Template.newchannel.onCreated(function() {
  this.data.channel = new Channel();
});

Template.newchannel.events({

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
        FlowRouter.go(`/channels/${res._id}`);
      });
    }
  }

});
