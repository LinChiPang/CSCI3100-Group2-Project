Feature: Analytics dashboard
  Scenario: Admin views analytics dashboard
    Given there are 2 transactions
    When I visit the analytics dashboard
    Then I should see the frontend app shell
