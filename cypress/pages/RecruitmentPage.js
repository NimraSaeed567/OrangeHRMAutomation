class RecruitmentPage {
  visitAddCandidate() {
    cy.visit("/web/index.php/recruitment/addCandidate");
    return this;
  }

  visitCandidateList() {
    cy.visit("/web/index.php/recruitment/viewCandidates");
    return this;
  }

  get saveButton() {
    return cy.contains("button", "Save");
  }

  get searchButton() {
    return cy.contains("button", "Search");
  }

  get candidateNameSearchInput() {
    return cy.contains("label", "Candidate Name").parents(".oxd-input-group").find("input");
  }

  get tableRows() {
    return cy.get(".oxd-table-card");
  }

  // Candidate name is a single labelled group with unlabelled First/Last
  // inputs distinguished only by placeholder - same structure as the PIM
  // "Employee Full Name" field.
  addCandidate({ firstName, lastName, email }) {
    this.visitAddCandidate();
    cy.get('input[placeholder="First Name"]').clear().type(firstName);
    cy.get('input[placeholder="Last Name"]').clear().type(lastName);
    cy.contains("label", "Email").parents(".oxd-input-group").find("input").clear().type(email);
    this.saveButton.click();
    return this;
  }

  searchByCandidateName(name) {
    this.candidateNameSearchInput.clear().type(name);
    return this;
  }

  submitSearch() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as("candidateSearch");
    this.searchButton.click();
    cy.wait("@candidateSearch");
    return this;
  }

  deleteCandidateByCheckbox() {
    cy.get(".oxd-table-card").first().find('input[type="checkbox"]').click({ force: true });
    cy.contains("button", "Delete Selected").click();
    cy.contains("button", "Yes, Delete").click();
    return this;
  }
}

export default new RecruitmentPage();
