Feature: Test for my portfolio website

  Scenario: 01 Visiting the portfolio website from mobile
    When I visit my portfolio website from "mobile"
    Then I expect following labels available at side menu
      |   Labels           |
      |   About Me         |
      |   Experience       |
      |   Portfolio        |
      |   Contact          |

  Scenario: 02 Expect the About Me is default active
    When I visit my portfolio website from "desktop"
    When I click on the "About Me" in the sidebar
    Then I expect the "About Me" is active
    And I expect the "Experience" is not active
    And I expect the "Portfolio" is not active
    And I expect the "Contact" is not active

  Scenario: 03 Expect the dark mode is default active 
    When I visit my portfolio website from "desktop"
    Then I expect the dark mode is enabled

  Scenario: 04 Expect the light mode is possible to activate   
    When I visit my portfolio website from "desktop"
    When I choose the light mode
    Then I expect the light mode is enabled

  Scenario: 05 Expect the side menu is closed after choosing the page on the mobile  
    When I visit my portfolio website from "mobile"
    Then I expect the sidebar is opened
    When I click on the "Experience" in the sidebar
    Then I expect the sidebar is not opened
    And I click on the menu icon
    Then I expect the "Experience" is active