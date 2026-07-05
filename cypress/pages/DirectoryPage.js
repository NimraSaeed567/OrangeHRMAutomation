import { AUTOCOMPLETE_OPTION_SELECTOR } from "../support/selectors";

class DirectoryPage {
  visit() {
    cy.visit("/web/index.php/directory/viewDirectory");
    return this;
  }

  get employeeNameInput() {
    return cy.get('input[placeholder="Type for hints..."]').first();
  }

  get searchButton() {
    return cy.contains("button", "Search");
  }

  get resetButton() {
    return cy.contains("button", "Reset");
  }

  searchByEmployeeName(name) {
    cy.intercept("GET", "**/api/v2/directory/employees*").as("directoryAutocomplete");
    this.employeeNameInput.clear().invoke("val", name).trigger("input").trigger("keyup");
    cy.wait("@directoryAutocomplete");
    cy.get(AUTOCOMPLETE_OPTION_SELECTOR, { timeout: 10000 }).should("have.length.at.least", 1);
    cy.contains(AUTOCOMPLETE_OPTION_SELECTOR, name).click();
    return this;
  }

  submitSearch() {
    this.searchButton.click();
    return this;
  }
}

export default new DirectoryPage();
