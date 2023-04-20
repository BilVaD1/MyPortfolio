import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { viewports } from '../../../fixtures/viewports';

Then(/^I expect the mouse is( not)* displayed$/, (falseCase) => {
    if (!falseCase) {
        cy.get("div[test-id='mouse']").should('exist')
      } else {
        cy.get("div[test-id='mouse']").should('not.exist')
      }
  });


Then(/^I hover on the link "(.*)" in the sidebar$/, (link) => {
    const el = cy.get('[test-id="sidebar"] a').contains(link).trigger('mouseover')
});

Then(/^I expect the mouse color is "(.*)"$/, (color) => {
    cy.get("div[test-id='mouse']").find('div')
        .should('have.css', 'background-color', color);
});