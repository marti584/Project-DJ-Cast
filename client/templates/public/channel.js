Template.channel.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var channelId = FlowRouter.getParam('id');

    self.subscribe('oneChannel', channelId);

    self.urls = new ReactiveVar([]);

    Meteor.call('/channels/getUrls', channelId, (err, res) => {
      if (err) {
        throw err;
      }
      self.urls.set(res);
    });
  });

});

Template.channel.helpers({
  channel: function() {
    var channelId = FlowRouter.getParam('id');
    return Channel.findOne(channelId);
  },
  preview: function() {
    return Template.instance().urls.get();
  }
});
