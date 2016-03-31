History = new Mongo.Collection('history');

History = Astronomy.createClass({
  name: 'History',
  collection: History,
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

History.getLatest = function(channelID) {

  return History.find({
    channelID: channelID
  }, {
    sort: {createdAt: -1}, 
    limit: 5
  });
}

 History.getRecent = function(channelID) {
  // Default to 20
  limit = 6;

  return History.find({
    channelID: channelID
  }, {
    sort: {createdAt: -1}, 
    limit: limit
  });
}
