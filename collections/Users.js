// An Astro class used as a nested field in the User class below
UserProfile = Astronomy.createClass({
  name: 'UserProfile',
  /* No collection attribute */
  fields: {

    // An array of Channel ids that the user has subscribed to
    channelSubscriptions: {
      type: 'array',
      nested: 'string',
      default() {
        return [];
      }
    }
  }
});

/*
 * An Astro wrapper around the accounts-password user collection
 * NOTE: This wrapper does not handle any validation rules, but 
 *       let's the accounts-password package handle them. 
 */
User = Astronomy.createClass({
  name: 'User',
  // Use the built-in Accounts' user collection
  collection: Meteor.users,
  fields: {

    // Username
    username: 'string',

    // Array of user's email addresses
    emails: 'array',

    // The date the user was created
    createdAt: 'date',

    // Services applied to this user, such as encrypted password, facebook login info, resume token, etc.
    services: 'object',
    
    // The UserProfile, a storage place for misc. info specific to a single User
    profile: {
      type: 'object',
      nested: 'UserProfile',
      default() {
        return {};
      }
    }
  },

  methods: {
    /*
     * Returns an array of this user's subscribed channels
     * 
     * @return{Mongo.Cursor}
     */
    getSubscriptions() {
      let subscriptions = this.get('profile.channelSubscriptions');
      return Channel.find({
        _id: {$in: subscriptions}
      });
    },

    /*
     * Tests whether this User is already subscribed to the given channel
     *
     * @param{Channel} channel The channel to check whether this user is subscribed to or not
     * @return{Boolean}
     */
    isSubscribedTo(channel) {
      // Test whether any of my subscribed channels' IDs are equal to the passed channel's ID
      return this.getSubscriptions().fetch().some((testChannel) => {
        return channel.get('_id') === testChannel.get('_id');
      });
    },

    /*
     * Subscribes this user to the given channel
     * Throws Meteor.Error when trying to subscribe to the same channel twice
     *
     * @param{Channel} channel The channel to subscribe to
     * @return{User} This user
     */
    subscribeTo(channel) {

      // Make sure we aren't already subscribed to this channel
      if(this.isSubscribedTo(channel)) {
        throw new Meteor.Error('duplicate-channel-subscription', 'You are already subscribed to this channel.');
      }


      // Add the channel's ID to my subscribed channel list
      this.push('profile.channelSubscriptions', channel.get('_id'));
      this.save();
      return this;
    },

    /*
     * Unsubscribes this user from the given channel
     *
     * @param{Channel} channel The channel to unsubscribe from
     * @return{User} this user
     */
    unsubscribeFrom(channel) {
      let subscriptions = this.get('profile.channelSubscriptions'),
          channelIndex = subscriptions.indexOf(channel.get('_id'));
      if(channelIndex > -1) {
        this.pull('profile.channelSubscriptions', channel.get('_id'));
        this.save();
      }
      return this;
    }
  }
});

User.me = () => User.findOne({_id: Meteor.userId()});

// Protect the user's profile
Meteor.users.deny({
  update() {
    // Deny all updates to the User's profile
    //  Any updates must go through a method.
    return true;
  }
});
