/*
 * Publishes the latest Channels, sorted by creation date
 */
Meteor.publish('latestSong', function(channelID) {
	check(channelID, String);
  return Song.getLatest(channelID);
});

/*
 * Publish access to a single channel
 */
Meteor.publish('songList', function(id) {
  check(id, String);
  return Song.getChannelList(id);
});

