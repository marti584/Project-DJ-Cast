Meteor.methods({
  /*
   * Inserts a Youtube into the database
   *
   * @param {Channel} channel Channel object to insert (Astronomy class)
   * @return {Channel} the saved Channel
   */
  '/youtube/new': function(song) {
    check(song, Song)

    if(song.validate()) {
      song.save();
    } else {
      // Send errors back to the client
      song.throwValidationException();
    }
  }
});
