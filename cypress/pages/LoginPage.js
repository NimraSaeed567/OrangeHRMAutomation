class LoginPage {
  visit() {
    cy.visit("/web/index.php/auth/login");
    return this;
  }

  get usernameInput() {
    return cy.get('input[name="username"]');
  }

  get passwordInput() {
    return cy.get('input[name="password"]');
  }

  get submitButton() {
    return cy.get('button[type="submit"]');
  }

  get errorAlert() {
    return cy.get(".oxd-alert-content-text");
  }

  get forgotPasswordLink() {
    return cy.contains("Forgot your password?");
  }

  login(username, password) {
    this.usernameInput.clear().type(username);
    this.passwordInput.clear().type(password, { log: false });
    this.submitButton.click();
    return this;
  }
}

export default new LoginPage();
