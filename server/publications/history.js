Meteor.publish('history', function(channelID) {
	check(channelID, String);
  return History.getRecent(channelID);
});
