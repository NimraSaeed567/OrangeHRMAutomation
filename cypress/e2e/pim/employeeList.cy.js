import PimPage from "../../pages/PimPage";
import { randomPersonName } from "../../support/testData";

describe("PIM > Employee List", () => {
  beforeEach(() => {
    cy.login();
    PimPage.visit();
  });

  it("displays the employee list", () => {
    cy.contains("Employee Information").should("be.visible");
    PimPage.table.should("be.visible");
    PimPage.tableRows.should("have.length.at.least", 1);
  });

  it("searches for an existing employee by name", () => {
    PimPage.tableRows
      .first()
      .find(".oxd-table-cell")
      .eq(2)
      .invoke("text")
      .then((fullName) => {
        const firstName = fullName.trim().split(" ")[0];
        PimPage.searchByEmployeeName(firstName);
        PimPage.submitSearch();
        PimPage.tableRows.should("have.length.at.least", 1);
      });
  });

  it("adds a new employee and then deletes them", () => {
    const { firstName, lastName } = randomPersonName();

    PimPage.addEmployee({ firstName, lastName }).then((employeeId) => {
      cy.contains(`${firstName} ${lastName}`).should("be.visible");

      PimPage.visit();
      PimPage.searchByEmployeeId(employeeId);
      PimPage.submitSearch();
      cy.contains(`${firstName} ${lastName}`).should("be.visible");

      PimPage.deleteEmployeeByCheckbox();

      PimPage.visit();
      PimPage.searchByEmployeeId(employeeId);
      PimPage.submitSearch();
      cy.contains("No Records Found").should("be.visible");
    });
  });

  // First/Middle/Last are sub-fields of one "Employee Full Name" group, so
  // a missing name produces a single combined Required message, not one per
  // sub-field.
  it("shows a validation error when Employee Name is missing on Add Employee", () => {
    PimPage.visitAddEmployee();
    PimPage.saveButton.click();
    cy.contains(".oxd-input-group .oxd-text--span", "Required").should("be.visible");
  });

  it("shows no records for an Employee Id that does not exist", () => {
    PimPage.searchByEmployeeId("999999");
    PimPage.submitSearch();
    cy.contains("No Records Found").should("be.visible");
  });
});
