import DirectoryPage from "../../pages/DirectoryPage";
import PimPage from "../../pages/PimPage";

describe("Directory", () => {
  beforeEach(() => {
    cy.login();
  });

  it("displays the directory", () => {
    DirectoryPage.visit();
    cy.contains("Directory").should("be.visible");
  });

  it("searches for an existing employee by name", () => {
    PimPage.visit();
    PimPage.tableRows
      .first()
      .find(".oxd-table-cell")
      .eq(2)
      .invoke("text")
      .then((fullName) => {
        const firstName = fullName.trim().split(/\s+/)[0];

        DirectoryPage.visit();
        DirectoryPage.searchByEmployeeName(firstName);
        DirectoryPage.submitSearch();
        cy.contains(firstName).should("be.visible");
      });
  });
});
