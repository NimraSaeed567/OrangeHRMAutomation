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
});
