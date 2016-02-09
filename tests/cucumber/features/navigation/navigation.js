'use strict';

// You can include npm dependencies for support files in tests/cucumber/package.json
var _ = require('underscore');
// You can use normal require here, cucumber is NOT run in a Meteor context (by design)
var url = require('url');

module.exports = function () {

  this.Given(/^I am on the home page$/, function () {
    browser.url(process.env.ROOT_URL);
  });

  this.Given(/^I am on the new channels page$/, function () {
    browser.url(url.resolve(process.env.ROOT_URL, '/channels/new'));
  });

  this.When(/^I navigate to "([^"]*)"$/, function (relativePath) {
    browser.url(url.resolve(process.env.ROOT_URL, relativePath));
  });

  this.Then(/^I should see the title "([^"]*)"$/, function (expectedTitle) {
    browser.waitForExist('title');
    var actual = browser.getTitle();
    expect(actual).toBe(expectedTitle);
  });
};
