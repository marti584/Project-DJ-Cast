Template.channel.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var channelId = FlowRouter.getParam('id');

    self.subscribe('oneChannel', channelId);

    // self.urls = new ReactiveVar([]);

    // Meteor.call('/channels/getUrls', channelId, (err, res) => {
    //   if (err) {
    //     throw err;
    //   }
    //   self.urls.set(res);
    // });
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


Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    console.log("SEARCHING");
    var text = $(e.target).val().trim();
    console.log(text);
    self.urls = new ReactiveVar([]);
    Meteor.call('/youtube/searchForMusic', text, 1, function(err, res) {
      if (err) {
        throw err;
      }
      console.log(JSON.stringify(res,null,2));
      self.urls.set(res);
    });
  }, 200)
});

Template.searchBox.helpers({

  getSearchResults: function() {
    return self.urls;
  },

  searchForMusic: function(searchText) {
    
  }
});