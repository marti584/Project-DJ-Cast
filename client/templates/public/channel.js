var recommendationList = [];

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

  getQueue: function() {
    var channelId = FlowRouter.getParam('id');
    var currentSong = Song.getLatest(channelId).fetch()[0];
    console.log(currentSong);
    return Song.getQueue(channelId, currentSong._id).fetch();
  },

  nextS: function() {
    var channelId = FlowRouter.getParam('id');
    var currentSong = Song.getLatest(channelId).fetch()[0];
    return Song.getQueue(channelId, currentSong._id).fetch()[0];
  },

  recommendations: function() {
    console.log(recommendationList.toString());
    return recommendationList.toString();
  }

});

Template.channel.events({
  'click button': function(e, tmpl) {
    if (e.currentTarget.id === "CloseRoom") {
      e.stopPropagation();
      var channel = Channel.findOne(this._id);
      Meteor.call('/channels/end', channel, function(err, res) {
          FlowRouter.go('/channels');
      });
    }
  },
});

Template.channel.events({
  "click input": function(e) {
    if (e.target.id == "upvoteButton") {
      var song = Song.find({_id: this._id}).fetch()[0];
      Meteor.call('/songs/upvote', song, function(err, res) { 

      } );
    }
    if (e.target.id == "downvoteButton") {
      console.log("downvote");
      var song = Song.find({_id: this._id}).fetch()[0];
      Meteor.call('/songs/downvote', song, function(err, res) { 

      } );
    }
  }
})

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
    newsong.set("votes", 1);

    document.getElementsByClassName('list-group')[0].hidden = true;   
    document.getElementsByClassName('search')[0].value = '';
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
    var currentSong = Song.getLatest(channelId).fetch()[0];
    return Song.getQueue(channelId, currentSong._id).fetch()[0];
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
      Meteor.call('/song/remove', song, function(err, res) { 
        if (err) {}
          if (Song.getLatest(channelId).fetch()[0]) {
            player.loadVideoById(Song.getLatest(channelId).fetch()[0].videoID, 0, "default");
            player.playVideo();
          }
      } );

			Meteor.subscribe('history', channelId);
			var i;
			var size = History.getLatest(channelId).fetch().length;
			var lastPlayed = History.getLatest(channelId).fetch();


			//Clean the Video Title to get the Artist only
			var myUrl = 'http://developer.echonest.com/api/v4/artist/extract';

			var cleanedArtists = [];
			for(i = 0; i < size; i++){
				var args = {
									format: 'json',
									api_key: 'DHTQGX3WXZI7YKQSF',
									text: lastPlayed[i].title,
									min_familiarity: '0.7',
									results: 1,
				};

				$.ajax({
					type: 'GET',
					url: myUrl,
					data: args,
					dataType: 'json',
					success: function(data){
						cleanedArtists[i] = data.response.artists[0].name;
					},
					async: false
				});

			}
			
			//for(i = 0; i < size; i++){
				//console.log("Artist: " + cleanedArtists[i]);
			//}

			//for(i = 0; i < size; i++){
				//console.log("Artists: " + JSON.stringify(cleanedArtists[i]));
			//}
			//Suggest similar artists
			myUrl = 'http://developer.echonest.com/api/v4/artist/similar';
			var args = {
						format: 'json',
						api_key: 'DHTQGX3WXZI7YKQSF',
						name: cleanedArtists,
						min_familiarity: '.8',
						results: 10,
			}

			var similarIDS = [];
			var similarArtists = [];
			$.ajax({
				type: 'GET',
				url: myUrl,
				data: args,
				dataType: 'json',
				traditional: true,
				success: function(data) {
					var j = 0;
					$.each(data.response.artists, function (key, val){
						similarArtists[j] = val.name;
						similarIDS[j] = val.id;
						j++;
					});
				},
				async: false
			});

			//for(i = 0; i < similarArtists.length; i++){
				//console.log("Similar Artist: " + similarArtists[i]);
			//}

			//Get the hottest song for each similar artist
			myUrl = 'http://developer.echonest.com/api/v4/song/search';
			var k;
			var recommendations = [];
			for(k = 0; k < similarArtists.length; k++){
				recommendations[k] = "";
			}
			for(k = 0; k < similarIDS.length; k++){
				var args = {
									format: 'json',
									api_key: 'DHTQGX3WXZI7YKQSF',
									artist_id: similarIDS[k],
									sort: 'song_hotttnesss-desc',
									min_tempo: '100',
									min_danceability: '.7',
									results: 1,
				}

				$.ajax({
					type: 'GET',
					url: myUrl,
					data: args,
					dataType: 'json',
					success: function(data){
						//$each(data.response.songs, function (key, val){
						
						//});

						recommendations[k] = recommendations[k].concat(similarArtists[k]);
						recommendations[k] = recommendations[k].concat(" - ");
						recommendations[k] = recommendations[k].concat(data.response.songs[0].title);
					},
					async: false
				});
			}

			console.log("Recommend:");
			for(k = 0; k < recommendations.length; k++){
        recommendationList[k] = recommendations[k];
				console.log(recommendations[k]);
			}





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

Template.sourceSelect.helpers({
  getCurrentScr: function() {
    var sel = document.getElementById('src');
    return sel.options[ sel.selectedIndex ].value;
  }
});
