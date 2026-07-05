import JobTitlesPage from "../../pages/JobTitlesPage";
import { randomJobTitle } from "../../support/testData";

describe("Admin > Job Titles", () => {
  beforeEach(() => {
    cy.login();
  });

  it("displays the job title list", () => {
    JobTitlesPage.visit();
    cy.contains("Job Titles").should("be.visible");
    JobTitlesPage.tableRows.should("have.length.at.least", 1);
  });

  it("adds a new job title and then deletes it", () => {
    const title = randomJobTitle();

    JobTitlesPage.addJobTitle({ title, description: "Created by Cypress automation" });
    cy.contains(title).should("be.visible");

    JobTitlesPage.deleteByTitle(title);
    cy.contains(title).should("not.exist");
  });

  it("adds a job title with no description", () => {
    const title = randomJobTitle();

    JobTitlesPage.addJobTitle({ title });
    cy.contains(title).should("be.visible");

    JobTitlesPage.deleteByTitle(title);
  });

  it("shows a validation error when Job Title is left empty", () => {
    JobTitlesPage.visit();
    JobTitlesPage.addButton.click();
    JobTitlesPage.saveButton.click();
    cy.contains(".oxd-input-group .oxd-text--span", "Required").should("be.visible");
  });

  it("discards the form when Cancel is clicked", () => {
    const title = randomJobTitle();

    JobTitlesPage.visit();
    JobTitlesPage.addButton.click();
    JobTitlesPage.inputByLabel("Job Title").type(title);
    JobTitlesPage.cancelButton.click();

    cy.url().should("include", "/admin/viewJobTitleList");
    cy.contains(title).should("not.exist");
  });
});
