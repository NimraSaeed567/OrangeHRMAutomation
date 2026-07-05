import LoginPage from "../pages/LoginPage";

describe("Login", () => {
  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
    LoginPage.visit();
  });

  it("shows the demo credentials hint", () => {
    cy.contains("Username : Admin");
    cy.contains("Password : admin123");
  });

  it("logs in successfully with valid credentials", () => {
    LoginPage.login("Admin", "admin123");
    cy.url().should("include", "/dashboard/index");
    cy.contains("Dashboard").should("be.visible");
  });

  it("shows an error with invalid credentials", () => {
    LoginPage.login("Admin", "wrongPassword");
    LoginPage.errorAlert.should("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });

  it("requires both username and password", () => {
    LoginPage.submitButton.click();
    cy.contains("Required").should("have.length.at.least", 1);
  });

  it("navigates to the forgot password flow", () => {
    LoginPage.forgotPasswordLink.click();
    cy.url().should("include", "/auth/requestPasswordResetCode");
    cy.contains("Reset Password").should("be.visible");
  });
});
