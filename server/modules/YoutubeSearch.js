YoutubeSearcher = Meteor.npmRequire('youtube-node');
youTube = new YoutubeSearcher();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');


Modules.server.youtubeSearchSync = Meteor.wrapAsync(youTube.search);


// Modules.server.youtubeSearchSync('Zionsville High School HSL', 1, function(error, result) {
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

//   }
// });