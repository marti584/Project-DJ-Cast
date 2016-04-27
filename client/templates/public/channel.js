var recommendList = [];
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
    if (currentSong != null)
      return Song.getQueue(channelId, currentSong._id).fetch();
    else
      return undefined;
  },

  nextS: function() {
    var channelId = FlowRouter.getParam('id');
    var currentSong = Song.getLatest(channelId).fetch()[0];
    if (currentSong != null)
      return Song.getQueue(channelId, currentSong._id).fetch()[0];
    else
      return undefined;
  },
  isYoutube: function() {
    return Template.searchBox.currentSource == 'youtube';
  },

  recommendations: function() {
    return recommendationList.toString();
  }
  

});

Template.channel.events({
  "click input": function(e) {
    if (e.target.id == "upvoteButton") {
      var song = Song.find({_id: this._id}).fetch()[0];
      Meteor.call('/songs/upvote', song, function(err, res) { 

      } );
    }
    if (e.target.id == "downvoteButton") {
      var song = Song.find({_id: this._id}).fetch()[0];
      Meteor.call('/songs/downvote', song, function(err, res) { 

      } );
    }
    if (e.target.id == "playNow") {
      var song = Song.find({_id: this._id}).fetch()[0];
      Meteor.call('/songs/playnow', song, function(err, res) { 

      } );
    }
    if (e.target.id == "removeNow") {
      if (confirm('Do you want to submit?')) { 
        var song = Song.find({_id: this._id}).fetch()[0];
        Meteor.call('/song/remove', song, function(err, res) { 
          
        } );
      } 
    }
  }
})

Template.searchBox.onCreated(function() {
  var self = this;
  self.autorun(function() {
    Template.searchBox.currentSource = 'youtube';
    self.urls = new ReactiveVar([]);
  });

});

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e, template) {
    var text = $(e.target).val().trim();
    document.getElementsByClassName('list-group')[0].hidden = false;
    self.urls = new ReactiveVar([]);
    if (Template.searchBox.currentSource == 'youtube') {
      Meteor.call('/youtube/searchForMusic', text, 12, function(err, res) {
        if (err) {
          throw err;
        }
        template.urls.set(res.items);
      });
    } else if (Template.searchBox.currentSource == 'soundcloud') {
      Meteor.call('/soundcloud/searchForMusic', text, 12, function(err, res) {
        if (err) {
          throw err;
        }
        template.urls.set(res);
      });
    }
  }, 1000),
  "click .list-group-item": function (e, template) {
    var channelId = FlowRouter.getParam('id');
    var newsong = new Song();
    if (Template.searchBox.currentSource == 'youtube') {
      newsong.set("title",this.snippet.title);
      newsong.set("videoID", this.id.videoId);
      newsong.set("thumbnail", this.snippet.thumbnails.high.url);
      newsong.set("source", 'youtube');
    } else if (Template.searchBox.currentSource == 'soundcloud') {
      newsong.set("title", this.title);
      newsong.set("videoID", "" + this.id);
      newsong.set("thumbnail", this.artwork_url);
      newsong.set("source", 'soundcloud');
    }
    newsong.set("channelID", FlowRouter.getParam('id'));
    newsong.set("votes", 1);
    if (Song.getLatest(channelId).fetch()[0] != null)
      newsong.set("currentlyPlaying", false);
    else
      newsong.set("currentlyPlaying", true);

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
  },

  getCurrentSrc: function() {
    var sel = document.getElementById('src');
    self.currentSource = sel.options[ sel.selectedIndex ].value;
    return self.currentSource;
  },
  isYoutube: function() {
    return Template.searchBox.currentSource == 'youtube';
  }
});


Template.suggestionModal.helpers({
  recommendMe: function() {
    
    return recommendList.toString();
  }
});

Template.prepopulate.events({
	"click #populate-button": function (e, template) {
		//Get top pop artist
		var myUrl = 'http://developer.echonest.com/api/v4/genre/artists';

		var artists = [];
		var artistID = [];
		
		var args = {
							format: 'json',
							api_key: 'DHTQGX3WXZI7YKQSF',
							name: "pop",
							results: 10,
		};

		$.ajax({
			type: 'GET',
			url: myUrl,
			data: args,
			dataType: 'json',
			success: function(data){
				for(var i = 0; i < 10; i++){
					artists[i] = data.response.artists[i].name;
					artistID[i] = data.response.artists[i].id;
				}
			},
			async: false
		});


			myUrl = 'http://developer.echonest.com/api/v4/song/search';
			var k;
			var songpop = [];
			for(k = 0; k < artists.length; k++){
				songpop[k] = "";
			}
			for(k = 0; k < artistID.length; k++){
				var args = {
									format: 'json',
									api_key: 'DHTQGX3WXZI7YKQSF',
									artist_id: artistID[k],
									sort: 'song_hotttnesss-desc',
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

						songpop[k] = songpop[k].concat(artists[k]);
						songpop[k] = songpop[k].concat(" - ");
						songpop[k] = songpop[k].concat(data.response.songs[0].title);
					},
					async: false
				});
			}

			var g;
			for(g = 0; g < songpop.length; g++){
				console.log("top song: " + songpop[g]);
			
			
				Meteor.call('/youtube/searchForMusic', songpop[g], 1, function(err, res) {
        	var channelId = FlowRouter.getParam('id');
    			var newsong = new Song();
      		newsong.set("title", res.items[0].snippet.title);
      		newsong.set("videoID", res.items[0].id.videoId);
      		newsong.set("thumbnail", res.items[0].snippet.thumbnails.high.url);
      		newsong.set("source", 'youtube');

					console.log("title: " + newsong.title);
					console.log("id: " + newsong.videoID);
			

					newsong.set("channelID", FlowRouter.getParam('id'));
    			newsong.set("votes", 1);
    			if (Song.getLatest(channelId).fetch()[0] != null)
      			newsong.set("currentlyPlaying", false);
    			else
      			newsong.set("currentlyPlaying", true);
					
					Meteor.call('/youtube/new', newsong, function(err, res2) { 

    			} );
      	});

		}
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
  },
  isYoutube: function(source) {
    return source == 'youtube';
  }
});

Template.Moderator.events({
  "click input": function (e, template) {

    if (e.target.id === "CloseRoom") {
      if (sound != null)
        sound.pause();
      e.stopPropagation();
      var channel = Channel.findOne(this._id);
      Meteor.call('/channels/end', channel, function(err, res) {
          FlowRouter.go('/channels');
      });
    }

    if (e.target.id == "playPauseButton") {
      var channelId = FlowRouter.getParam('id');
      var song = Song.getLatest(channelId).fetch()[0];
      var button = document.getElementById("playPauseButton");
        if(button.value == "Pause"){
          button.value = "Play";
          if (song.source == 'youtube') {
            player.pauseVideo();
          }
          else {
            sound.pause();
          }
        }
        else{
        button.value = "Pause";
        if (song.source == 'youtube')
          player.playVideo()
        else
          sound.play();
      }
    }
    if (e.target.id == "skipButton") {
      var channelId = FlowRouter.getParam('id');
      var song = Song.getLatest(channelId).fetch()[0];
      var next = Template.channel.__helpers[" nextS"]();

      if (song.source == 'soundcloud')
        sound.pause();
      else
        player.pauseVideo();
      
      var hist = new History();
      hist.set("title", song.title);
      hist.set("videoID", "" + song.videoID);
      hist.set("thumbnail", song.thumbnail);
      hist.set("source", song.source); 
      hist.set("channelID", song.channelID);
      
      
      Meteor.call('/history/new', hist, function(err, res){});
      Meteor.call('/song/remove', song, function(err, res) { 
        if (err) {}
          if (next != null) {
            next.set("currentlyPlaying", true);
            Meteor.call('/songs/currentlyPlaying', next);
            if (next.source == 'youtube') {
              if (player != null) {
                player.loadVideoById(next.videoID, 0, "default");
                player.playVideo();
              }
            } else {
              if (sound != null)
                sound.pause();
              playSoundcloud(next.videoID);
            }
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
			for(k = 0; k < recommendations.length; k++){
        recommendList[k] = recommendations[k];
				//console.log(recommendations[k]);
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

Template.suggestionModal.events({
  "click button": function(e, template) {
  
  document.getElementById('reco').innerHTML = recommendList[0];
  document.getElementById('reco2').innerHTML = recommendList[1];
  document.getElementById('reco3').innerHTML = recommendList[2];
  document.getElementById('reco4').innerHTML = recommendList[3];
  document.getElementById('reco5').innerHTML = recommendList[4];
  }
});

Template.qrCode.helpers({
  getCurrentUrl : function() {
    return "localhost:3000" + FlowRouter.current().path;
  }
});

Template.sourceSelect.helpers({
  getCurrentSrc: function() {
    var sel = document.getElementById('src');
    Template.searchBox.currentSource = sel.options[ sel.selectedIndex ].value;
    return Template.searchBox.currentSource;
  }
});

Template.sourceSelect.events({
  "change select": function(e, template) {
    var sel = document.getElementById('src');
    Template.searchBox.currentSource = sel.options[ sel.selectedIndex ].value;
  }
});
