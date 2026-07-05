import LeavePage from "../../pages/LeavePage";

describe("Leave", () => {
  beforeEach(() => {
    cy.login();
  });

  it("opens the Apply Leave form", () => {
    LeavePage.visitApply();
    cy.contains("Apply Leave").should("be.visible");
    LeavePage.leaveTypeDropdown.should("be.visible");
  });

  it("opens My Leave list", () => {
    LeavePage.visitMyLeave();
    cy.contains("My Leave List").should("be.visible");
  });

  it("opens the Leave List admin view", () => {
    LeavePage.visitLeaveList();
    cy.contains("Leave List").should("be.visible");
  });

  it("displays filter controls on the Leave List admin view", () => {
    LeavePage.visitLeaveList();
    cy.contains("button", "Search").should("be.visible");
    cy.contains("button", "Reset").should("be.visible");
  });

  it("displays the My Leave List calendar/legend controls", () => {
    LeavePage.visitMyLeave();
    cy.contains("button", "Search").should("be.visible");
    cy.contains("button", "Reset").should("be.visible");
  });
});
