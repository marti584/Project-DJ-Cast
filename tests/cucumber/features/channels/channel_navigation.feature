Feature: New channel navigation
  As a public or authenticated user
  I want to navigate to the new channel page

  Background:
    Given I am on the home page

  # Test navigation to new channel page
  @dev
  Scenario: Navigate to new channel page 
    When I click on the new channels button
    Then the new channel header should have text "You must log in first"

  @dev
  Scenario: Log in and navigate to new channel page
    Given I am signed in
    When I click on the new channels button
    Then the new channel header should have text "Create a new channel"

