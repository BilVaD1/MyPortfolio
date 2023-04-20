Feature: Tests for my following mouse

    Scenario: 02 Expect the mouse is not displayed on the mobile
        When I visit my portfolio website from "mobile"
        Then I expect the mouse is not displayed


    Scenario: 02 Expect the mouse is displayed on the desktop
        When I visit my portfolio website from "desktop"
        Then I expect the mouse is displayed

    Scenario: 03 Expect the mouse is changed color on the links
        When I visit my portfolio website from "desktop"
        And I hover on the link "Experience" in the sidebar
        Then I expect the mouse color is "rgba(191, 75, 30, 0.7)"

    