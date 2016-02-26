Meteor.methods({ 
  /*
   * Reads a keyword and searches on youtube for matching keywords
   *
   * @param {keyword} the youtube string to search
   * @return {json} a JSON of results
   */
  '/youtube/getSearchResults': function(keyword) {
    // Check Arguments
    check(keyword, String);
 
    return Modules.server.youtubeSearchSync(Channel.findOne(keyword).get('query'));
  }
});
