Feature: Fuzzy search suggestions
  @javascript
  Scenario: User sees suggestions for a fuzzy query
    When I visit the search page
    And I type "lmp" into the search box
    Then I should see "Desk Lamp" in suggestions

