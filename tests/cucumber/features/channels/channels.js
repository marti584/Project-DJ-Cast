'use strict'

// You can include npm dependencies for support files in tests/cucumber/package.json
var _ = require('underscore');
// You can use normal require here, cucumber is NOT run in a Meteor context (by design)
var url = require('url');

module.exports = function () {

  this.Given(/^the database has "([^"]*)" channels$/, function (count) {
    browser.executeAsync(function(count, done) {
      Meteor.call('/fixtures/addChannels', count, done);
    }, parseInt(count));
  });

  this.When(/^I click on the new channels button$/, function () {
    browser.waitForVisible("#newchannel-btn");
    browser.click("#newchannel-btn");
  });

  this.When(/^I enter "([^"]*)" into the title field$/, function (text) {
    browser.waitForVisible("input#title");
    browser.setValue("input#title", text);
  });

  this.When(/^I enter "([^"]*)" into the query field$/, function (text) {
    browser.waitForVisible("input#query");
    browser.setValue("input#query", text);
  });

  this.When(/^I submit the new channel form$/, function () {
    browser.waitForVisible("input#submit");
    browser.click("input#submit");
  });

  this.Then(/^the new channel header should have text "([^"]*)"$/, function (text) {
    browser.waitForVisible("#newchannel-header");
    expect(browser.getText("#newchannel-header")).toBe(text);
  });

  this.Then(/^I should see a title required validation error$/, function () {
    browser.waitForVisible("#title-error");
    expect(browser.getText("#title-error")).toBe("The value of the \"title\" field is required");
  });

  this.Then(/^I should be on the new channels page$/, function () {
    expect(url.parse(browser.url().value).path).toMatch(/^\/channels\/[a-zA-Z0-9]*/);
  });

  this.Then(/^I should see a query required validation error$/, function () {
    browser.waitForVisible("#query-error");
    expect(browser.getText("#query-error")).toBe("The value of the \"query\" field is required");
  });

  this.Then(/^channel "([^"]*)" should display "([^"]*)"$/, function (element, text) {
    browser.waitForVisible('#channel-' + element);
    expect(browser.getText('#channel-' + element)).toBe(text);
  });

  this.Then(/^I should see "([^"]*)" channels$/, function (expectedCount) {
    expectedCount = parseInt(expectedCount);

    if(expectedCount > 0) {
      browser.waitForVisible('.list-group');
    }

    var numberOfChannelsOnPage = browser.elements('.list-group-item').value.length;
    expect(numberOfChannelsOnPage).toEqual(expectedCount);
  });

};
