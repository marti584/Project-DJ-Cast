Meteor.methods({
  /*
   * Subscribes the logged in User to the given Channel
   *
   * @param {Channel} channel The Channel to subscribe to
   * @return {User} the newly saved User
   */
  '/users/subscribe': function(channel) {
    check(channel, Channel);

    if(!Meteor.user()) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to subscribe to channels.');
    }

    // Check that the channel exists
    if(Channel.findOne(channel.get("_id"))) {
      User.me().subscribeTo(channel);
      return User.me();
    } else {
      throw new Meteor.Error('channel-not-found', 'That channel does not exist.');
    }
  },

  /*
   * Unsubscribes the logged in User from the given Channel
   *
   * @param {Channel} channel The Channel to unsubscribe from
   * @return {User} the newly saved User
   */
  '/users/unsubscribe': function(channel) {
    check(channel, Channel);

    if(!Meteor.user()) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to unsubscribe to channels.');
    }

    // Check that the channel exists
    if(Channel.findOne(channel.get("_id"))) {
      User.me().unsubscribeFrom(channel);
      return User.me();
    } else {
      throw new Meteor.Error('channel-not-found', 'That channel does not exist.');
    }
  }
});
