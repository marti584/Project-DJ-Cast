Meteor.methods({
  /*
   * Updates a Song
   *
   * @param {Song} song Song object to update (Astronomy class)
   * @return {Song} the saved song
   */
  '/songs/upvote': function(song) {
    check(song, Song)

    if(song.validate()) {
      var newVotes = song.votes + 1;
      Song.update({ _id: song._id }, {$set: {votes: newVotes}});
    } else {
      // Send errors back to the client
      song.throwValidationException();
    }
  }, 

  '/songs/downvote': function(song) {
    check(song, Song)

    if(song.validate()) {
      var newVotes = song.votes - 1;
      Song.update({ _id: song._id }, {$set: {votes: newVotes}});
    } else {
      // Send errors back to the client
      song.throwValidationException();
    }
  },

  '/songs/playnow': function(song) {
    check(song, Song)

    if(song.validate()) {
      Song.update({ _id: song._id }, {$set: {votes: 999}});
    } else {
      // Send errors back to the client
      song.throwValidationException();
    }
  } ,

  '/songs/currentlyPlaying': function(song) {
    check(song, Song);

    if (song.validate()) {
      Song.update({ _id: song._id }, {$set: {currentlyPlaying: true}})
    }
  } 
});