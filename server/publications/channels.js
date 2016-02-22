/*
 * Publishes the latest Channels, sorted by creation date
 */
Meteor.publish('latestChannels', function(limit) {
  return Channel.getLatest(limit);
});

/*
 * Publish access to a single channel
 */
Meteor.publish('oneChannel', function(id) {
  check(id, String);
  return Channel.find(id);
});

/*
 * Publish my subscribed channels
 */
Meteor.publish('myChannels', function() {
  if(!this.userId) {
    this.error(new Meteor.Error('unauthorized', 'You must be logged in to get your subscriptions.'));
  }
  let user = User.findOne(this.userId);
  return user.getSubscriptions();
});


Meteor.publish('searchYoutube', function(title) {
	check(title, String);

	Modules.server.youtubeSearchSync(title, 1, function(error, result) {
	  if (error) {
	    console.log(error);
	  }
	  else {
	    //console.log(JSON.stringify(result, null, 2));
	    //console.log('\n');
	    console.log("Video ID: " + result.items[0].id.videoId);
	    console.log("Title: " + result.items[0].snippet.title);
	    console.log("Description: "  + result.items[0].snippet.description);
	    console.log("Thumbnails: " + result.items[0].snippet.thumbnails);
	  }
	});

});