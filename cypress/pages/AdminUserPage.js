import { AUTOCOMPLETE_OPTION_SELECTOR } from "../support/selectors";

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

  // This widget intermittently fails to register a selection regardless of
  // whether it's clicked or chosen via keyboard - a real, occasional race in
  // the live app we don't control. Rather than chase a single perfectly-timed
  // approach, retry the whole selection when it doesn't register.
  selectFromAutocomplete(query, attempt = 1) {
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
    // Read the text, then select fresh at selection time rather than reusing
    // a captured element reference - if Vue re-renders the list in between
    // (even with identical data), a captured node detaches.
    let employeeName;
    cy.get(AUTOCOMPLETE_OPTION_SELECTOR, { timeout: 10000 })
      .should("have.length.at.least", 1)
      .first()
      .invoke("text")
      .then((text) => {
        employeeName = text.trim();
      });
    // Keyboard selection avoids the blur-race a mouse click can trigger
    // (input blurring before the click on the option completes), but even
    // this doesn't always register - hence the retry below.
    cy.get('input[placeholder="Type for hints..."]').first().type("{downarrow}{enter}");

    return cy
      .get('input[placeholder="Type for hints..."]')
      .first()
      .parents(".oxd-input-group")
      .then(($group) => {
        if ($group.text().includes("Invalid")) {
          if (attempt >= 3) {
            throw new Error(`Autocomplete selection for "${query}" still Invalid after ${attempt} attempts`);
          }
          cy.log(`Autocomplete selection did not register, retrying (attempt ${attempt + 1})`);
          return this.selectFromAutocomplete(query, attempt + 1);
        }
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
