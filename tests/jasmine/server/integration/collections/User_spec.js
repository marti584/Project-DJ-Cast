describe('User class', function() {

  beforeEach(function(){
    // Clear all current users
    Meteor.users.remove({});

    // Clear all channels
    Channel.remove({});

    // Create a new test user
    this.newUserId = Accounts.createUser({
      username: 'New User',
      password: 'letmein'
    });

    // Get the Astro class associated with this User
    this.user = User.findOne(this.newUserId);

    // Fake the login for this user
    this.userSpy = spyOn(Meteor, 'user').and.returnValue(this.user);
    this.userIdSpy = spyOn(Meteor, 'userId').and.returnValue(this.user._id);
  });

  afterEach(function() {
    // Clear all current users
    Meteor.users.remove({});

    // Clear all channels
    Channel.remove({});
  });

  it('can retrieve me', function() {
    expect(User.me().get('_id')).toBe(this.user._id);
  });

  it('can subscribe to channels', function() {
    // Create a new channel and subscribe to it
    let channel = new Channel({
      title: 'Fake channel',
      query: 'galaxies'
    });
    channel.save();
    this.user.subscribeTo(channel);
    expect(this.user.getSubscriptions().fetch()).toContain(channel);
  });

  it('can check whether it is subscribed to a channel', function() {
    // Create a new channel and subscribe to it
    let channel = new Channel({
      title: 'Fake channel',
      query: 'galaxies'
    });
    channel.save();
    this.user.subscribeTo(channel);
    expect(this.user.isSubscribedTo(channel)).toBe(true);
  });

  it('throws when trying to subscribe to the same channel twice', function() {
    // Create a new channel and subscribe to it
    let channel = new Channel({
      title: 'Fake channel',
      query: 'galaxies'
    });
    channel.save();
    this.user.subscribeTo(channel);
    try {
      this.user.subscribeTo(channel);
      fail('User should not be able to subscribe to the same channel twice');
    } catch(e) {
      expect(e.error).toBe('duplicate-channel-subscription');
    }
  });

  it('can unsubscribe from channels', function() {
    // Create a new channel and subscribe to it
    let channel = new Channel({
      title: 'Fake channel',
      query: 'galaxies'
    });
    channel.save();
    this.user.subscribeTo(channel);
    expect(this.user.getSubscriptions().fetch()).toContain(channel);
    this.user.unsubscribeFrom(channel);
    expect(this.user.getSubscriptions().fetch()).not.toContain(channel);
  });

  describe('User Profile', function() {
    it('is defined on creation', function() {
      expect(this.user.get('profile')).toBeDefined();
    });

    it('has channel subscriptions array', function() {
      let channelSubscriptions = this.user.get('profile').channelSubscriptions;
      expect(channelSubscriptions).not.toBeUndefined();
    });

    it('channel subscriptions are initially empty', function(){
      let channelSubscriptions = this.user.get('profile').channelSubscriptions;
      expect(channelSubscriptions.length).toBe(0);
    });
  });
});
