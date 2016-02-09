GoogleImageSearcher = Meteor.npmRequire('google-images');
Modules.server.googleImageSearchSync = Meteor.wrapAsync(GoogleImageSearcher.search);
