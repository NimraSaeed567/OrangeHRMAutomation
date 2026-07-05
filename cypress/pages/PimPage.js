// Suggestion items may render as <li>, a "oxd-autocomplete-option" div, or a
// plain child div depending on version - match whichever is actually there
// instead of betting on one unconfirmed structure.
const AUTOCOMPLETE_OPTION_SELECTOR = [
  ".oxd-autocomplete-dropdown li",
  ".oxd-autocomplete-dropdown [class*='option']",
  ".oxd-autocomplete-dropdown > div",
].join(", ");

class PimPage {
  visit() {
    cy.visit("/web/index.php/pim/viewEmployeeList");
    return this;
  }

  visitAddEmployee() {
    cy.visit("/web/index.php/pim/addEmployee");
    return this;
  }

  get employeeNameInput() {
    return cy.get('input[placeholder="Type for hints..."]').first();
  }

  get employeeIdInput() {
    return cy.contains("label", "Employee Id").parents(".oxd-input-group").find("input");
  }

  get searchButton() {
    return cy.contains("button", "Search");
  }

  get resetButton() {
    return cy.contains("button", "Reset");
  }

  get addButton() {
    return cy.contains("button", "Add");
  }

  get saveButton() {
    return cy.contains("button", "Save");
  }

  get table() {
    return cy.get(".oxd-table");
  }

  get tableRows() {
    return cy.get(".oxd-table-card");
  }

  // Sets the value in one atomic event instead of typing char-by-char - typing
  // key-by-key fires one API request per keystroke on this widget, and an
  // earlier keystroke's response can arrive after the final query's response
  // and silently overwrite the correct suggestion list with a stale one.
  searchByEmployeeName(name) {
    cy.intercept("GET", "**/api/v2/pim/employees*").as("employeeAutocomplete");
    this.employeeNameInput.clear().invoke("val", name).trigger("input").trigger("keyup");
    cy.wait("@employeeAutocomplete");
    cy.get(AUTOCOMPLETE_OPTION_SELECTOR, { timeout: 10000 }).should("have.length.at.least", 1);
    cy.contains(AUTOCOMPLETE_OPTION_SELECTOR, name).click();
    return this;
  }

  // A plain text filter on the primary employee table, unlike the name field
  // which goes through a search/autocomplete endpoint that can lag behind a
  // just-created employee - searching by the exact ID is far more reliable
  // for verifying/cleaning up an employee immediately after creating them.
  searchByEmployeeId(employeeId) {
    this.employeeIdInput.clear().type(employeeId);
    return this;
  }

  // Waits for the actual search response before returning - otherwise the
  // previous (unfiltered) rows are still on screen when the caller reads the
  // table, since row-count alone doesn't prove the new results have rendered.
  submitSearch() {
    cy.intercept("GET", "**/api/v2/pim/employees*").as("employeeSearch");
    this.searchButton.click();
    cy.wait("@employeeSearch");
    return this;
  }

  // The "Employee Full Name" field is a single labelled group containing
  // three unlabelled inputs (First/Middle/Last), distinguished only by
  // placeholder text - there is no separate <label> per input.
  //
  // Returns the "Employee Id" field's value (e.g. "0431") - NOT the
  // empNumber in the resulting URL. Those are two different identifiers:
  // empNumber is an internal DB id, while Employee Id is the user-facing
  // field the Employee List's "Employee Id" search filter actually matches.
  addEmployee({ firstName, lastName }) {
    this.visitAddEmployee();
    cy.get('input[placeholder="First Name"]').clear().type(firstName);
    cy.get('input[placeholder="Last Name"]').clear().type(lastName);
    this.saveButton.click();
    cy.url().should("include", "/pim/viewPersonalDetails/empNumber/");
    // The field auto-populates asynchronously after the page loads - wait
    // for a non-empty value instead of reading it immediately.
    return this.employeeIdInput.should("not.have.value", "").invoke("val");
  }

  // The native checkbox input is visually covered by a custom-styled icon
  // (the app's own checkbox skin), so Cypress's actionability check correctly
  // flags it as covered - force the click, same as a real user clicking the
  // visible icon would.
  deleteEmployeeByCheckbox() {
    cy.get(".oxd-table-card").first().find('input[type="checkbox"]').click({ force: true });
    cy.contains("button", "Delete Selected").click();
    cy.contains("button", "Yes, Delete").click();
    return this;
  }
}

export default new PimPage();
