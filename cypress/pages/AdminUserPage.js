// Suggestion items may render as <li>, a "oxd-autocomplete-option" div, or a
// plain child div depending on version - match whichever is actually there
// instead of betting on one unconfirmed structure.
const AUTOCOMPLETE_OPTION_SELECTOR = [
  ".oxd-autocomplete-dropdown li",
  ".oxd-autocomplete-dropdown [class*='option']",
  ".oxd-autocomplete-dropdown > div",
].join(", ");

class AdminUserPage {
  visit() {
    cy.visit("/web/index.php/admin/viewSystemUsers");
    return this;
  }

  inputByLabel(labelText) {
    return cy
      .contains("label", labelText)
      .parents(".oxd-input-group")
      .find("input");
  }

  dropdownByLabel(labelText) {
    return cy
      .contains("label", labelText)
      .parents(".oxd-input-group")
      .find(".oxd-select-text");
  }

  selectDropdownOption(labelText, optionText) {
    this.dropdownByLabel(labelText).click();
    cy.get(".oxd-select-dropdown").contains("span", optionText).click();
    return this;
  }

  get addButton() {
    return cy.contains("button", "Add");
  }

  get searchButton() {
    return cy.contains("button", "Search");
  }

  get resetButton() {
    return cy.contains("button", "Reset");
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

  get recordsFoundText() {
    return cy.get(".orangehrm-horizontal-padding.orangehrm-vertical-padding span").first();
  }

  searchByUsername(username) {
    this.inputByLabel("Username").clear().type(username);
    return this;
  }

  searchByUserRole(role) {
    this.selectDropdownOption("User Role", role);
    return this;
  }

  searchByEmployeeName(name) {
    cy.get('input[placeholder="Type for hints..."]').first().clear().type(name);
    cy.contains(AUTOCOMPLETE_OPTION_SELECTOR, name).click();
    return this;
  }

  // Sets the "Type for hints..." autocomplete value in one atomic event rather
  // than typing char-by-char. Typing key-by-key fires one API request per
  // keystroke (no debounce on this widget), and if an earlier keystroke's
  // (empty) response arrives after the final query's response, it silently
  // overwrites the good suggestion list with an empty one. Setting the value
  // in one shot means only the final query is ever requested.
  selectFromAutocomplete(query) {
    cy.intercept("GET", "**/api/v2/pim/employees*").as("employeeAutocomplete");
    cy.get('input[placeholder="Type for hints..."]')
      .first()
      .clear()
      .invoke("val", query)
      .trigger("input")
      .trigger("keyup");
    cy.wait("@employeeAutocomplete").then((interception) => {
      // query strings encode spaces as "+" (form-encoding), which
      // decodeURIComponent does not translate back to a literal space.
      const decodedUrl = decodeURIComponent(interception.request.url.replace(/\+/g, " "));
      expect(decodedUrl).to.include(`nameOrId=${query}`);
    });
    return cy
      .get(AUTOCOMPLETE_OPTION_SELECTOR, { timeout: 10000 })
      .should("have.length.at.least", 1)
      .first()
      .then(($option) => {
        const employeeName = $option.text().trim();
        cy.wrap($option).click();
        return cy.wrap(employeeName);
      });
  }

  searchByStatus(status) {
    this.selectDropdownOption("Status", status);
    return this;
  }

  // Waits for the actual search response before returning - otherwise the
  // previous (unfiltered) rows are still on screen when the caller reads the
  // table, since row-count alone doesn't prove the new results have rendered.
  submitSearch() {
    cy.intercept("GET", "**/api/v2/admin/users*").as("userSearch");
    this.searchButton.click();
    cy.wait("@userSearch");
    return this;
  }

  resetSearch() {
    this.resetButton.click();
    return this;
  }

  // employeeQuery should be broad (e.g. a single common letter) since this is a
  // shared public demo instance - specific employee names are not guaranteed to exist.
  addUser({ userRole, employeeQuery, status, username, password }) {
    this.addButton.click();
    this.selectDropdownOption("User Role", userRole);
    const employeeName = this.selectFromAutocomplete(employeeQuery);
    this.selectDropdownOption("Status", status);
    this.inputByLabel("Username").clear().type(username);
    this.inputByLabel("Password").clear().type(password, { log: false });
    this.inputByLabel("Confirm Password").clear().type(password, { log: false });
    this.saveButton.click();
    return employeeName;
  }

  editActionForRow(username) {
    return cy
      .contains(".oxd-table-card", username)
      .find('.oxd-icon.bi-pencil-fill, [class*="pencil"]')
      .parent();
  }

  deleteActionForRow(username) {
    return cy
      .contains(".oxd-table-card", username)
      .find('.oxd-icon.bi-trash, [class*="trash"]')
      .parent();
  }

  deleteUser(username) {
    this.deleteActionForRow(username).click();
    cy.contains("button", "Yes, Delete").click();
    return this;
  }

  rowCheckboxByUsername(username) {
    return cy
      .contains(".oxd-table-card", username)
      .find('.oxd-table-cell input[type="checkbox"]');
  }
}

export default new AdminUserPage();
