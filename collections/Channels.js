Channels = new Mongo.Collection('channels');

Channel = Astronomy.createClass({
  name: 'Channel',
  collection: Channels,
  fields: {

    /* The title of the Channel */
    title: {
      validator: [
        Validators.required(),
        Validators.string(),
        Validators.maxLength(30)
      ]
    },

    /* The Google Image search query */
    query: {
      validator: [
        Validators.required(),
        Validators.string(),
        Validators.maxLength(250)
      ]
    },

    /* The ID of the creator */
    creator: {
      type: 'string',
      // The ID of the user is set in the 'beforeSave' event
      // It can only be set once!
      immutable: true
    }
  },

  events: {
    beforeInsert: function(e) {
      this.set('creator', Meteor.userId());
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
Channel.getLatest = function(limit) {
  // Default to 20
  limit = limit || 20;

  // Cap the limit parameter
  if(limit > 100) {
    limit = 100;
  }

  return Channel.find({}, {
    sort: {createdAt: -1}, 
    limit: limit
  });
}
