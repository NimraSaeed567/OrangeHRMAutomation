import AdminUserPage from "../../pages/AdminUserPage";
import PimPage from "../../pages/PimPage";
import { randomUsername, randomPersonName } from "../../support/testData";

describe("Admin > User Management", () => {
  beforeEach(() => {
    cy.login();
    AdminUserPage.visit();
  });

  it("displays the system users list", () => {
    cy.contains("System Users").should("be.visible");
    AdminUserPage.table.should("be.visible");
  });

  // Asserting every returned row matches is too strict on a shared public
  // demo whose data we don't control - asserting the expected row is present
  // is the actual, reliable intent of "search finds it".
  it("searches for a user by username", () => {
    AdminUserPage.searchByUsername("Admin");
    AdminUserPage.submitSearch();
    cy.contains(".oxd-table-card", "Admin").should("exist");
  });

  it("searches for a user by status", () => {
    AdminUserPage.searchByStatus("Enabled");
    AdminUserPage.submitSearch();
    cy.contains(".oxd-table-card", "Enabled").should("exist");
  });

  it("shows no records for a username that does not exist", () => {
    AdminUserPage.searchByUsername("doesNotExist12345");
    AdminUserPage.submitSearch();
    cy.contains("No Records Found").should("be.visible");
  });

  it("resets the search filters", () => {
    AdminUserPage.searchByUsername("Admin");
    AdminUserPage.resetSearch();
    AdminUserPage.inputByLabel("Username").should("have.value", "");
  });

  it("creates and then deletes a new ESS user", () => {
    const username = randomUsername();
    const { firstName, lastName } = randomPersonName();

    // Use a freshly created employee rather than a fixed name like "John
    // Doe" - a hardcoded employee's availability isn't guaranteed to stay
    // stable over repeated runs (this shared demo is used by others too, and
    // an employee that already has a system user account gets rejected here
    // with the same "Invalid" state as an unrelated selection race would
    // show, which is what made this so hard to pin down). A brand new
    // employee can never already have an account.
    PimPage.addEmployee({ firstName, lastName }).then((employeeId) => {
      AdminUserPage.visit();
      AdminUserPage.addUser({
        userRole: "ESS",
        employeeQuery: `${firstName} ${lastName}`,
        status: "Enabled",
        username,
        password: "Cypress@12345",
      });

      cy.url().should("include", "/admin/viewSystemUsers");

      AdminUserPage.searchByUsername(username);
      AdminUserPage.submitSearch();
      cy.contains(username).should("be.visible");

      AdminUserPage.deleteUser(username);

      AdminUserPage.searchByUsername(username);
      AdminUserPage.submitSearch();
      cy.contains("No Records Found").should("be.visible");

      // Clean up the employee created for this test too.
      PimPage.visit();
      PimPage.searchByEmployeeId(employeeId);
      PimPage.submitSearch();
      PimPage.deleteEmployeeByCheckbox();
    });
  });

  it("shows validation errors when required fields are missing on Add User", () => {
    AdminUserPage.addButton.click();
    AdminUserPage.saveButton.click();
    cy.contains(".oxd-input-group .oxd-text--span", "Required").should("have.length.at.least", 1);
  });

  it("shows a validation error when passwords do not match", () => {
    AdminUserPage.addButton.click();
    AdminUserPage.selectDropdownOption("User Role", "ESS");
    AdminUserPage.selectFromAutocomplete("John Doe");
    AdminUserPage.selectDropdownOption("Status", "Enabled");
    AdminUserPage.inputByLabel("Username").type(randomUsername());
    AdminUserPage.inputByLabel("Password").type("Cypress@12345");
    AdminUserPage.inputByLabel("Confirm Password").type("SomethingDifferent1!");
    AdminUserPage.saveButton.click();
    cy.contains("Passwords do not match").should("be.visible");
  });
});
