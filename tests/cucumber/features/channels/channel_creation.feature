Feature: Channel creation
  As an authenticated user
  I want to create a channel

  Background:
    Given I am signed in
    And I am on the new channels page

  # Test creation and validation of new channels
  @dev
  Scenario: Create a valid new channel
    When I enter "Galaxy" into the title field
    And I enter "pony+galaxy" into the query field
    And I submit the new channel form
    Then I should be on the new channels page
    And channel "title" should display "Galaxy"
    And channel "query" should display "pony+galaxy"

  @dev
  Scenario: Submit channel with empty title
    When I enter "pony+galaxy" into the query field
    And I submit the new channel form
    Then I should see a title required validation error

  @dev
  Scenario: Submit channel with empty query
    When I enter "Galaxy" into the title field
    And I submit the new channel form
    Then I should see a query required validation error

