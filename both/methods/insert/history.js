Meteor.methods({
  /*
   * Inserts a Youtube into the database
   *
   * @param {Channel} channel Channel object to insert (Astronomy class)
   * @return {Channel} the saved Channel
   */
  '/history/new': function(hist) {
    check(hist, History);

    if(hist.validate()) {
      hist.save();
    } else {
      // Send errors back to the client
      hist.throwValidationException();
    }
  }
});
