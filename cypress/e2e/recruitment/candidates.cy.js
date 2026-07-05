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

    RecruitmentPage.addCandidate({ firstName, lastName, email });
    cy.url().should("include", "/recruitment/");
    cy.contains(`${firstName} ${lastName}`).should("be.visible");

    RecruitmentPage.visitCandidateList();
    RecruitmentPage.searchByCandidateName(`${firstName} ${lastName}`);
    RecruitmentPage.submitSearch();
    cy.contains(`${firstName} ${lastName}`).should("be.visible");

    RecruitmentPage.deleteCandidateByCheckbox();

    // Candidates are soft-deleted - the row stays in search results tagged
    // "(Deleted)" rather than disappearing, unlike Admin/PIM records.
    RecruitmentPage.visitCandidateList();
    RecruitmentPage.searchByCandidateName(`${firstName} ${lastName}`);
    RecruitmentPage.submitSearch();
    cy.contains(`${firstName} ${lastName}`).should("be.visible");
    cy.contains("(Deleted)").should("be.visible");
  });
});
