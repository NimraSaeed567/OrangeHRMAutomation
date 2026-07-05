Cypress.Commands.add("login", (username = "Admin", password = "admin123") => {
  cy.session(
    [username, password],
    () => {
      cy.visit("/web/index.php/auth/login");
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password, { log: false });
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/dashboard/index");
    },
    {
      validate: () => {
        cy.visit("/web/index.php/dashboard/index");
        cy.url().should("include", "/dashboard/index");
      },
    }
  );
});
