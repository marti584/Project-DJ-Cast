Meteor.methods({
  /*
   * Inserts a Youtube into the database
   *
   * @param {Channel} channel Channel object to insert (Astronomy class)
   * @return {Channel} the saved Channel
   */
  '/song/remove': function(song) {
    check(song, Song)

    if(song.validate()) {
      song.remove();
    } else {
      // Send errors back to the client
      song.throwValidationException();
    }
  }
});
