class NationalitiesPage {
  visit() {
    cy.visit("/web/index.php/admin/nationality");
    return this;
  }

  inputByLabel(labelText) {
    return cy.contains("label", labelText).parents(".oxd-input-group").find("input");
  }

  get addButton() {
    return cy.contains("button", "Add");
  }

  get saveButton() {
    return cy.contains("button", "Save");
  }

  get cancelButton() {
    return cy.contains("button", "Cancel");
  }

  get tableRows() {
    return cy.get(".oxd-table-card");
  }

  addNationality(name) {
    this.visit();
    this.addButton.click();
    this.inputByLabel("Name").clear().type(name);
    this.saveButton.click();
    cy.url().should("include", "/admin/nationality");
    return this;
  }

  deleteByName(name) {
    cy.contains(".oxd-table-card", name).find('[class*="trash"]').parent().click();
    cy.contains("button", "Yes, Delete").click();
    return this;
  }
}

export default new NationalitiesPage();
