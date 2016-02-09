describe('Channel insert method', function() {
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
    //   This will return 'null' because we're obviously not logged in
    this.userSpy.and.callThrough();
    let channel = new Channel({
      title: 'Logged out',
      query: 'Should throw'
    });

    try {
      Meteor.call('/channels/new', channel);
      fail('method should throw if we are not logged in');
    } catch(e) {
      expect(e.error).toBe('unauthorized');
    }
  });

  it('throws validation exception when given bad data', function() {
    let channel = new Channel({
      title: '',
      query: ''
    });

    Meteor.call('/channels/new', channel, function(err) {
      channel.catchValidationException(err);
      let errors = channel.getValidationErrors();
      expect(channel.hasValidationErrors()).toBe(true);
      expect(errors.title).not.toBeNull();
      expect(errors.query).not.toBeNull();
    });
  });

});
