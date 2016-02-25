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
        Validators.string(),
      ]
    },
    channelID: {
      validator: [
        Validators.required(),
        Validators.string()
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
Song.getLatest = function(limit) {
  // Default to 20
  limit = limit || 20;

  // Cap the limit parameter
  if(limit > 100) {
    limit = 100;
  }

  return song.find({}, {
    sort: {createdAt: -1}, 
    limit: limit
  });
}

Song.getChannelList = function(channelID) {
  return song.find({}, {
    channelID: channelID
  });
}
