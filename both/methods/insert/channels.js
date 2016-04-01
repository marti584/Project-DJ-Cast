Meteor.methods({
  /*
   * Inserts a Channel into the database
   *
   * @param {Channel} channel Channel object to insert (Astronomy class)
   * @return {Channel} the saved Channel
   */
  '/channels/new': function(channel) {
    // Check arguments
    check(channel, Channel);

    // Check that the user is logged in
    if(!Meteor.user()) throw new Meteor.Error('unauthorized', 
                                             'You must be logged in to create a channel.');

    // Validate the Channel
    if(channel.validate()) {
      channel.save();
      return channel;
    } else {
      // Send errors back to the client
      channel.throwValidationException();
    }
  },

  '/channels/end': function(channel) {
    check(channel, Channel);

    if (!Meteor.user()) throw new Meteor.Error('unauthorized', 'You must be logged in to remove a channel');

    if (User.me()._id != channel.creator) throw new Meteor.Error('unauthorized', 'You are not authorized to remove a channel');

    if(channel.validate()) {
      let list = Song.getChannelList(channel._id);
      let hist = History.getChannelList(channel._id);
      for (var i = 0; i < list.length; i++) {
        list[i].remove();
      }
      for (var i = 0; i < hist.length; i++) {
        hist[i].remove();
      }
      channel.remove();
    } else {
      // Send errors back to the client
      channel.throwValidationException();
    }
  }
});
