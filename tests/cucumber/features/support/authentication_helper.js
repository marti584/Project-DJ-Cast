module.exports = function () {
  this.Before(function () {

    this.AuthenticationHelper = {
      login: function (username, password) {
        browser.url(process.env.ROOT_URL);
        browser.executeAsync(function (username, password, done) {
          Meteor.loginWithPassword(username, password, done);
        }, username, password);
      },

      logout: function () {
        browser.executeAsync(function (done) {
          Meteor.logout(done);
        });
      },

      createAccount: function (email, password) {
        server.call('test/createAccount', email, password);
      },

      createAccountAndLogin : function(profile) {
        this.createAccount(profile);
        this.login();
      }
    };

  });
};
