Template.channel.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var channelId = FlowRouter.getParam('id');

    self.subscribe('oneChannel', channelId);
    self.subscribe('songList', channelId);
    self.subscribe('latestSong', channelId);
    self.subscribe('history', channelId);
  });

});

Template.channel.helpers({
  channel: function() {
    var channelId = FlowRouter.getParam('id');
    return Channel.findOne(channelId);
  },
  currentSong: function() {
    var channelId = FlowRouter.getParam('id');
    return Song.getLatest(channelId).fetch()[0];
  },
  history: function() {
    var channelId = FlowRouter.getParam('id');
    return History.getLatest(channelId).fetch()[0];
  },
  getRecent: function() {
    var channelId = FlowRouter.getParam('id');
    return History.getRecent(channelId).fetch();
  },
  isModerator: function() {
    var channelId = FlowRouter.getParam('id');
    return User.me()._id == Channel.findOne(channelId).creator;
  },
  nextS: function() {
    var channelId = FlowRouter.getParam('id');
    return Song.getChannelList(channelId).fetch()[1];
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
    document.getElementsByClassName('list-group')[0].hidden = false;
    self.urls = new ReactiveVar([]);
    Meteor.call('/youtube/searchForMusic', text, 12, function(err, res) {
      if (err) {
        throw err;
      }
      template.urls.set(res.items);
    });
    
    

  }, 1000),
  "click .list-group-item": function (e, template) {
    var newsong = new Song();
    newsong.set("title",this.snippet.title);
    newsong.set("videoID", this.id.videoId);
    newsong.set("thumbnail", this.snippet.thumbnails.high.url);
    newsong.set("source", this.id.kind); 
    newsong.set("channelID", FlowRouter.getParam('id'));

    document.getElementsByClassName('list-group')[0].hidden = true;
    document.getElementsByClassName('search')[0].placeholder = 'search youtube here';
    Meteor.call('/youtube/new', newsong, function(err, res) { 

    } );
  }
});

Template.searchBox.helpers({
  getSearchResults: function() {
    return Template.instance().urls.get();
  },

  checkCharCount: function(title) {
    return title.length < 40;
  }
});


Template.Moderator.onCreated(function() {
  var channelId = FlowRouter.getParam('id');
  this.subscribe('latestSong', channelId);
  this.subscribe('songList', channelId);
  this.subscribe('history', channelId);
});

Template.Moderator.helpers({
  currentSong: function() {
    var channelId = FlowRouter.getParam('id');
    return Song.getLatest(channelId).fetch()[0];
  },
  nextSong: function() {
    var channelId = FlowRouter.getParam('id');
    return Song.getChannelList(channelId).fetch()[1].videoID;
  }
});

Template.Moderator.events({
  "click input": function (e, template) {
    if (e.target.id == "skipButton") {
      var channelId = FlowRouter.getParam('id');
      var song = Song.getLatest(channelId).fetch()[0];
      
      var hist = new History();
      hist.set("title", song.title);
      hist.set("videoID", song.videoID);
      hist.set("thumbnail", song.thumbnail);
      hist.set("source", song.source); 
      hist.set("channelID", song.channelID);
      
      
      Meteor.call('/history/new', hist, function(err, res){});
      Meteor.call('/song/remove', Song.getLatest(channelId).fetch()[0], function(err, res) { 
        if (err) {}
          if (Song.getLatest(channelId).fetch()[0]) {
            player.loadVideoById(Song.getLatest(channelId).fetch()[0].videoID, 0, "default");
            player.playVideo();
          }
      } );
    }
  },
});


Template.qrCode.events({
  "click button": function(e, template) {
    var status = document.getElementsByClassName('showQr')[0].hidden;
    document.getElementsByClassName('showQr')[0].hidden = !status;
  }
});

Template.qrCode.helpers({
  getCurrentUrl : function() {
    return "localhost:3000" + FlowRouter.current().path;
  }
});

