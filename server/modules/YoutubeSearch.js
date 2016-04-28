YoutubeSearcher = Meteor.npmRequire('youtube-node');
youTube = new YoutubeSearcher();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

Modules.server.youtubeSearchSync = Meteor.wrapAsync(youTube.search);

youTube.addParam('type', 'video');
