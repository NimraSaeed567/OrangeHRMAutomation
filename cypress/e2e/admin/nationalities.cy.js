import NationalitiesPage from "../../pages/NationalitiesPage";
import { randomNationality } from "../../support/testData";

describe("Admin > Nationalities", () => {
  beforeEach(() => {
    cy.login();
  });

  it("displays the nationalities list", () => {
    NationalitiesPage.visit();
    cy.contains("Nationalities").should("be.visible");
    NationalitiesPage.tableRows.should("have.length.at.least", 1);
  });

  it("adds a new nationality and then deletes it", () => {
    const name = randomNationality();

    NationalitiesPage.addNationality(name);
    cy.contains(name).should("be.visible");

    NationalitiesPage.deleteByName(name);
    cy.contains(name).should("not.exist");
  });

  it("shows a validation error when Name is left empty", () => {
    NationalitiesPage.visit();
    NationalitiesPage.addButton.click();
    NationalitiesPage.saveButton.click();
    cy.contains(".oxd-input-group .oxd-text--span", "Required").should("be.visible");
  });

  it("discards the form when Cancel is clicked", () => {
    const name = randomNationality();

    NationalitiesPage.visit();
    NationalitiesPage.addButton.click();
    NationalitiesPage.inputByLabel("Name").type(name);
    NationalitiesPage.cancelButton.click();

    cy.url().should("include", "/admin/nationality");
    cy.contains(name).should("not.exist");
  });

  it("does not save a nationality name made only of spaces", () => {
    NationalitiesPage.visit();
    NationalitiesPage.addButton.click();
    NationalitiesPage.inputByLabel("Name").type("   ");
    NationalitiesPage.saveButton.click();
    cy.contains(".oxd-input-group .oxd-text--span", "Required").should("be.visible");
  });
});
