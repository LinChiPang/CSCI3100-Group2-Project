Feature: Smoke test
  Scenario: Visitor sees homepage
    When I visit the homepage
    Then I should see "Hello World"

