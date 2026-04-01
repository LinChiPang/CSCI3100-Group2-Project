Feature: Mock payment
  Scenario: User completes a mock checkout
    When I visit the payments page
    And I submit a mock payment for "Desk Lamp" with amount 120
    Then I should see "Mock Stripe payment succeeded"

