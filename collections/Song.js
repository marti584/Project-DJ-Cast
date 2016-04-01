Songs = new Mongo.Collection('songs');

Song = Astronomy.createClass({
  name: 'Song',
  collection: Songs,
  fields: {

    /* The title of the Song */
    title: {
      validator: [
        Validators.required(),
        Validators.string()
      ]
    },

    /* The VideoURL search query */
    videoID: {
      validator: [
        Validators.required(),
        Validators.string()
      ]
    },

    /* The ID of the creator */
    thumbnail: {
      type: 'string'
    },

    /*Youtube; SoundCloud. This will help with VideoID.
    * Sound cloud gives a full URL and Youtube gives just a VideoID tag
    */ 
    source: {
      validator: [
        Validators.required(),
        Validators.string()
      ]
    },
    channelID: {
      validator: [
        Validators.required(),
        Validators.string()
      ]
    }, 
    votes: {
      validator: [
        Validators.required(),
        Validators.number()
      ]
    }
  },

  /* createdAt and updatedAt fields */
  behaviors: ['timestamp']
});

/*
 * Queries for the latest Channels, sorted by creation date.
 *
 * @param {number} limit The number of channels to fetch, capped at 100
 * @return {Mongo.Cursor} the resulting Mongo cursor from find()
 */
Song.getLatest = function(channelID) {
  return Song.find({
    channelID: channelID
  }, {
    sort: {createdAt: 1}, 
    limit: 1
  });
}

Song.getChannelList = function(channelID) {
  return Song.find({
    channelID: channelID
  });
}

Song.getQueue = function(channelID, currentSongID) {
  console.log(currentSongID);
  return Song.find({
    _id: { $ne: currentSongID },
    channelID: channelID
  }, {
    sort: {votes: -1}
  });
}
