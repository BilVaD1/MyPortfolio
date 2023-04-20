import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { viewports } from '../../../fixtures/viewports';


When(/^I visit my portfolio website from "(mobile|desktop)"$/, (device) => {
  const viewport = viewports[device];
  cy.viewport(viewport.width, viewport.height);
  cy.visit('/');
});

Then(/^I expect following labels available at side menu$/, (table) => {
  const expected = [].concat(...table.rows());
  console.log(`Expected: ${expected}`)
  cy.get('p').find('span.capitalize').each(($el) => {
    const label = $el.text().trim();
    expect(expected.includes(label), `Label "${label}" not found in expected labels`).to.be.true;
  });
});

Then(/^I expect the "(.*)" is( not)* active$/, (link, falseCase) => {
  cy.get('[test-id="sidebar"] a').contains(link).then(($el) => {
    if (!falseCase) {
      const checkEl = $el.parents('[test-id="sidebar"] a')
      expect(checkEl).to.have.class('active');
    } else {
      const checkEl = $el.parents('[test-id="sidebar"] a')
      expect(checkEl).to.not.have.class('active');
    }
  });
});

Then(/I click on the "(.*)" in the sidebar$/, (link) => {
  const el = cy.get('[test-id="sidebar"] a').contains(link)
  el.click()
});

Then(/I expect the (dark|light) mode is enabled$/, (mode) => {
  cy.get(`div.${mode}`).should('exist')
});

Then(/I choose the (dark|light) mode$/, (mode) => {
  cy.get(`#${mode}`).click()
});

Then(/I expect the sidebar is( not)* opened$/, (falseCase) => {
  if (!falseCase) {
    cy.get("div[test-id='sidebar']").should('exist')
  } else {
    cy.get("div[test-id='sidebar']").should('not.exist')
  }
});

Then(/I click on the menu icon$/, () => {
  cy.get('[test-id="burger-menu"]').click()
});
