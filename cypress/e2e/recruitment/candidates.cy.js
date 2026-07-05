import RecruitmentPage from "../../pages/RecruitmentPage";
import { randomCandidate } from "../../support/testData";

describe("Recruitment > Candidates", () => {
  beforeEach(() => {
    cy.login();
  });

  it("displays the candidate list", () => {
    RecruitmentPage.visitCandidateList();
    cy.contains("Candidates").should("be.visible");
  });

  it("adds a new candidate and then deletes them", () => {
    const { firstName, lastName, email } = randomCandidate();
    const fullName = `${firstName} ${lastName}`;

    RecruitmentPage.addCandidate({ firstName, lastName, email });
    cy.contains(fullName).should("be.visible");

    RecruitmentPage.visitCandidateList();
    RecruitmentPage.searchByCandidateName(fullName);
    RecruitmentPage.submitSearch();
    cy.contains(".oxd-table-card", fullName).should("be.visible");

    // The delete API call succeeding (checked inside deleteCandidateByCheckbox)
    // is the source of truth here - re-searching immediately afterward has
    // proven unreliable on this shared demo (search-index lag).
    RecruitmentPage.deleteCandidateByCheckbox();
    cy.contains("Candidates").should("be.visible");
  });

  it("shows validation errors when required fields are missing on Add Candidate", () => {
    RecruitmentPage.visitAddCandidate();
    RecruitmentPage.saveButton.click();
    cy.contains(".oxd-input-group .oxd-text--span", "Required").should("have.length.at.least", 1);
  });

  it("shows a validation error when only First Name is provided", () => {
    const { firstName } = randomCandidate();

    RecruitmentPage.visitAddCandidate();
    cy.get('input[placeholder="First Name"]').clear().type(firstName);
    RecruitmentPage.saveButton.click();
    cy.contains(".oxd-input-group .oxd-text--span", "Required").should("be.visible");
  });

  it("discards the form when Cancel is clicked", () => {
    const { firstName, lastName } = randomCandidate();

    RecruitmentPage.visitAddCandidate();
    cy.get('input[placeholder="First Name"]').clear().type(firstName);
    cy.get('input[placeholder="Last Name"]').clear().type(lastName);
    RecruitmentPage.cancelButton.click();

    cy.url().should("include", "/recruitment/viewCandidates");
    cy.contains(`${firstName} ${lastName}`).should("not.exist");
  });
});
