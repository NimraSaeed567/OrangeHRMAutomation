import "./commands";

// OrangeHRM demo occasionally throws uncaught app exceptions (unrelated to test
// correctness) - don't let them fail the spec.
Cypress.on("uncaught:exception", () => false);
