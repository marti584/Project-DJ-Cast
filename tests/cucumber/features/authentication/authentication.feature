Feature: Authentication
  As a registered user
  I want to login to my account
  So that I can manage my account, create channels, and subscribe to channels

  Background:
    Given I am on the home page

  @dev
  Scenario: I can register for an account
    When I click on the signup link
    And I enter "Galaxy" into the username field
    And I enter "password" into the password field
    And I enter "password" into the password again field
    And I submit the registration form
    Then "Galaxy" should be signed in

  @dev
  Scenario: I can log in to my account
    When I click on the signin link
    And I enter "Phony" into the username field
    And I enter "password" into the password field
    And I submit the login form
    Then "Phony" should be signed in
