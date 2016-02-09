'use strict';

// You can include npm dependencies for support files in tests/cucumber/package.json
var _ = require('underscore');
// You can use normal require here, cucumber is NOT run in a Meteor context (by design)
var url = require('url');

module.exports = function () {

  this.Given(/^I am signed in$/, function() {
    // Login with the fixture user
    this.AuthenticationHelper.login('Phony', 'password');
  });

  this.Given(/^I am signed out$/, function() {
    this.AuthenticationHelper.logout();
  });

  this.Then(/^"([^"]*)" should be signed in$/, function(username) {
    browser.waitUntil(function() {
      return username === browser.getText('#login-dropdown-list .dropdown-toggle');
    });
  });

  this.When(/^I click on the signup link$/, function() {
    browser.waitForVisible("a.dropdown-toggle");
    browser.click("a.dropdown-toggle");
    browser.waitForVisible("#signup-link");
    browser.click("#signup-link");
  });

  this.When(/^I click on the signin link$/, function () {
    browser.waitForVisible("a.dropdown-toggle");
    browser.click("a.dropdown-toggle");
  });
  
  this.When(/^I enter "([^"]*)" into the username field$/, function (text) {
    browser.waitForVisible("#login-username");
    browser.setValue("#login-username", text);
  });

  this.When(/^I enter "([^"]*)" into the password field$/, function (text) {
    browser.waitForVisible("#login-password");
    browser.setValue("#login-password", text);
  });

  this.When(/^I enter "([^"]*)" into the password again field$/, function (text) {
    browser.waitForVisible("#login-password-again");
    browser.setValue("#login-password-again", text);
  });

  this.When(/^I submit the registration form$/, function () {
    browser.waitForExist("#login-buttons-password");
    browser.click("#login-buttons-password");
  });

  this.When(/^I submit the login form$/, function () {
    browser.waitForExist("#login-buttons-password");
    browser.click("#login-buttons-password");
  });

};
