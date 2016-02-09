/*
 * Resets the entire databaes on the mirror
 */
var resetDatabase = function () {
  // safety check
  if (!process.env.IS_MIRROR) {
    throw new Meteor.Error(
      'NOT_ALLOWED',
      'velocityReset is not allowed outside of a mirror. Something has gone wrong.'
    );
  }

  var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
  var collections = Meteor.wrapAsync(db.collections, db)();
  var appCollections = _.reject(collections, function (col) {
    return col.collectionName.indexOf('velocity') === 0 ||
      col.collectionName === 'system.indexes'
  });

  _.each(appCollections, function (appCollection) {
    console.log('remove ' + appCollection.collectionName);
    Meteor.wrapAsync(appCollection.remove, appCollection)();
  });
};

Meteor.methods({

  '/fixtures/reset': resetDatabase,

  /*
   * Add a user to the database
   *
   * @param{Object} opts
   * @param{String} opts.username
   * @param{String} opts.password
   */
  '/fixtures/addUser': function(opts) {
    check(opts, Object);
    Accounts.createUser({
      username: opts.username,
      password: opts.password ? opts.password : "password"
    });
  },

  /*
   * Add the specified number of random channels to the database
   *
   * @param{Number} count The number of channels to add
   */
  '/fixtures/addChannels': function(count) {
    check(count, Number);
    var channels = [];
    _.each(_.range(count), function() {
      var channel = new Channel({
        title: faker.internet.userName(),
        query: faker.hacker.phrase()
      });
      channel.save();
      channels.push(channel);
    });
    return channels;
  },

  /*
   * Add a specific channel
   *
   * @param{String} paramtitle Title of the channel
   * @param{String} paramquery Query of the channel
   */
  '/fixtures/addChannel': function(title, query) {
    check(title, String);
    check(query, String);

    var channel = new Channel({
      title, query
    });
    channel.save();
    return channel;
  }
});
