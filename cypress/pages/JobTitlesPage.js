class JobTitlesPage {
  visit() {
    cy.visit("/web/index.php/admin/viewJobTitleList");
    return this;
  }

  inputByLabel(labelText) {
    return cy.contains("label", labelText).parents(".oxd-input-group").find("input");
  }

  textAreaByLabel(labelText) {
    return cy.contains("label", labelText).parents(".oxd-input-group").find("textarea");
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

  // This list has no search/filter form - just the plain paginated list.
  addJobTitle({ title, description }) {
    this.visit();
    this.addButton.click();
    this.inputByLabel("Job Title").clear().type(title);
    if (description) {
      this.textAreaByLabel("Job Description").clear().type(description);
    }
    this.saveButton.click();
    cy.url().should("include", "/admin/viewJobTitleList");
    return this;
  }

  deleteByTitle(title) {
    cy.contains(".oxd-table-card", title).find('[class*="trash"]').parent().click();
    cy.contains("button", "Yes, Delete").click();
    return this;
  }
}

export default new JobTitlesPage();
