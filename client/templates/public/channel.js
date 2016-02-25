Template.channel.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var channelId = FlowRouter.getParam('id');

    self.subscribe('oneChannel', channelId);

  });

});

Template.channel.helpers({
  channel: function() {
    var channelId = FlowRouter.getParam('id');
    return Channel.findOne(channelId);
  }
});

Template.searchBox.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.urls = new ReactiveVar([]);
  });

});

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e, template) {
    var text = $(e.target).val().trim();
    self.urls = new ReactiveVar([]);
    Meteor.call('/youtube/searchForMusic', text, 12, function(err, res) {
      if (err) {
        throw err;
      }
      template.urls.set(res.items);
    });
  }, 1000),
  "click .list-group-item": function (e, template) {
    var song = new Song();
    song.set("title",this.snippet.title);
    song.set("videoID", this.id.videoId);
    song.set("thumbnail", this.snippet.thumbnails.high.url);
    song.set("source", this.id.kind); 
    song.set("channelID", FlowRouter.getParam('id'));

    Meteor.call('/youtube/new', song, function(err, res) { 

    } );

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

