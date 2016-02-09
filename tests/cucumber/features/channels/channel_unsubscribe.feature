Feature: Channel unsubscription
  As an authenticated user
  I want to unsubscribe from channels
  So that I can stop following channels I don't like

  Background:
    Given I am on the home page
    And I am signed in

  # Test channel subscription
  @dev
  Scenario: Unsubscribe from a channel that I am already subscribed to
    Given I created channel "Galaxy" with "galaxy pony"
    And I am subscribed to "Galaxy"
    When I click on the "Galaxy" channel's unsubscribe button
    Then I should be unsubscribed from "Galaxy"
