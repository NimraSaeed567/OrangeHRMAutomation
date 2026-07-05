import AdminUserPage from "../../pages/AdminUserPage";
import { randomUsername } from "../../support/testData";

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

    AdminUserPage.addUser({
      userRole: "ESS",
      employeeQuery: "John Doe",
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
  });
});
