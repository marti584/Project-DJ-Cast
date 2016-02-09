describe('image fetcher', function() {
  /*
   * Set up some fake user credentials and spies to simulate logging in
   */
  beforeEach(function() {
    this.fakeUser = {
      _id: '12345',
      username: 'Fakey'
    };
    this.userIdSpy = spyOn(Meteor, 'userId').and.returnValue(this.fakeUser._id);
  });

  afterEach(function() {
    // Remove any channels we've created
    Channel.remove({});
  });

  it('should return 4 urls from the channel query', function() {
    let channel = new Channel({
      title: 'My Test Channel',
      query: 'little flower ponies'
    });
    channel.save();
    spyOn(Modules.server, 'googleImageSearchSync').and.returnValue([
      { url: 'www.test.com' },
      { url: 'www.test.com' },
      { url: 'www.test.com' },
      { url: 'www.test.com' }
    ]);
    urls = Meteor.call('/channels/getUrls', channel._id);
    expect(urls.length).toEqual(4);
    for (i = 0; i < urls.length; i++) {
      expect(urls[i].url).not.toEqual('');
    }

    // Clean up 
    channel.remove();
  });
});
