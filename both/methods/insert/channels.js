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
  }
});
