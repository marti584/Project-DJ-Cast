Meteor.methods({
	'/soundcloud/searchForMusic': function(title, maxDepth, callback) {
		check(title, String);
		check(maxDepth, Number);
		return Soundcloud.getClient().getSync('/tracks', {limit: maxDepth, q : title}, callback);
	}
});
