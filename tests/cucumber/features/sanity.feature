Feature: Static Pages

  As a guest user
  I want to navigate to public pages
  So that I can see what this site is about

  @dev
  Scenario: Visit home page
    When I navigate to "/"
    Then I should see the title "BetterBackground"
