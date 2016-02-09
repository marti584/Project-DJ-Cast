describe('User subscribe method', function() {
  /*
   * Set up some fake user credentials and spies to simulate logging in
   */
  beforeEach(function() {
    this.fakeUser = {
      _id: '12345',
      username: 'Fakey'
    };
    this.userSpy = spyOn(Meteor, 'user').and.returnValue(this.fakeUser);
    this.userIdSpy = spyOn(Meteor, 'userId').and.returnValue(this.fakeUser._id);
  });

  it('throws if we are NOT logged in', function() {
    // Call through to the original Meteor.user() implementation
    //   This will return 'null' because we're not logged in
    this.userSpy.and.callThrough();
    let channel = new Channel({
      title: 'Logged out',
      query: 'Should throw'
    });
    channel.save();

    try {
      Meteor.call('/users/subscribe', channel);
      fail('method should throw if we are not logged in');
    } catch(e) {
      expect(e.error).toBe('unauthorized');
    }

    channel.remove();
  });

  it('throws if the given channel does not exist', function() {
    let channel = new Channel({
      title: 'Logged out',
      query: 'Should throw'
    });
    /* Do not save it! */

    try {
      Meteor.call('/users/subscribe', channel);
      fail('method should throw if the channel does not exists');
    } catch(e) {
      expect(e.error).toBe('channel-not-found');
    }
  });

  it('calls the subscribe to method', function() {
    let subscribeToSpy = jasmine.createSpy('subscribeTo');
    let meSpy = spyOn(User, 'me').and.returnValue({
      subscribeTo: subscribeToSpy
    });
    
    let channel = new Channel({
      title: 'Logged out',
      query: 'Should throw'
    });
    channel.save();

    Meteor.call('/users/subscribe', channel);
    // Here we'll just check that we are correctly calling the model method.
    //   We are already testing that method works in a different test.
    expect(subscribeToSpy).toHaveBeenCalledWith(channel);


    channel.remove();
  });

});
