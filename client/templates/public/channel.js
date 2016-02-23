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
  }
  // preview: function() {
  //   return Template.instance().urls.get();
  // }
});

Template.searchBox.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.urls = new ReactiveVar([]);
  });

});

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e, template) {
    console.log("SEARCHING");
    var text = $(e.target).val().trim();
    self.urls = new ReactiveVar([]);
    Meteor.call('/youtube/searchForMusic', text, 12, function(err, res) {
      if (err) {
        throw err;
      }
      //console.log(JSON.stringify(res,null,2));
      template.urls.set(res.items);
    });
  }, 1000),
  "click .list-group-item": function (e, template) {
    // console.log(e.target);
    console.log(this);
  }
});

Template.searchBox.helpers({

  getSearchResults: function() {
    console.log(JSON.stringify(Template.instance().urls.get(),null,2));
    return Template.instance().urls.get();
  },

  checkCharCount: function(title) {
    return title.length < 40;
  }
});

