Meteor.methods({ 
  /*
   * Reads a Channel and searches for its images
   *
   * @param {channelId} the Channel object to read
   * @param {start_page} the starting page number
   * @param {num_pages} the number of pages to grab images
   * @return {Images} an array of image objects
   */
  '/channels/getUrls': function(channelId) {
    // Check Arguments
    check(channelId, String);
 
    return Modules.server.googleImageSearchSync(Channel.findOne(channelId).get('query'));
  }
});
