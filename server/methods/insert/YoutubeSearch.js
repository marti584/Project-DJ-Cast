Meteor.methods({
	'/youtube/searchForMusic': function(title, maxDepth, callback) {
			check(title, String);
			check(maxDepth, Number);
			return Modules.server.youtubeSearchSync(title, maxDepth, callback);
	}
});

