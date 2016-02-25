
Meteor.methods({
	'/youtube/searchForMusic': function(title, maxDepth, callback) {
			check(title, String);
			check(maxDepth, Number);
			return Modules.server.youtubeSearchSync(title, maxDepth, callback);

		// Modules.server.youtubeSearchSync(title, 1, function(error, result) {
		//   if (error) {
		//     console.log(error);
		//   }
		//   else {
		//     //console.log(JSON.stringify(result, null, 2));
		//     //console.log('\n');
		//     console.log("Video ID: " + result.items[0].id.videoId);
		//     console.log("Title: " + result.items[0].snippet.title);
		//     console.log("Description: "  + result.items[0].snippet.description);
		//     console.log("Thumbnails: " + result.items[0].snippet.thumbnails);
		//     return result;
		//   }
		// });
	}
});

