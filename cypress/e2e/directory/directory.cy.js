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

  it("displays results for the default, unfiltered search", () => {
    DirectoryPage.visit();
    DirectoryPage.submitSearch();
    cy.contains(/\(\d+\) Records Found/).should("be.visible");
  });

  // Reset clears a committed selection, not raw uncommitted text - typing
  // without picking a suggestion never registers as a "selected" value, so
  // the field must go through a real selection first for this to be a valid
  // test of Reset's actual behavior.
  it("resets the employee name filter after a selection", () => {
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
        DirectoryPage.resetButton.click();
        DirectoryPage.employeeNameInput.should("have.value", "");
      });
  });

  it("displays the search controls", () => {
    DirectoryPage.visit();
    DirectoryPage.employeeNameInput.should("be.visible");
    DirectoryPage.searchButton.should("be.visible");
    DirectoryPage.resetButton.should("be.visible");
  });
});
