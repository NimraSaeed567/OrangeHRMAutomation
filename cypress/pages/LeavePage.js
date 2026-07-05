class LeavePage {
  visitApply() {
    cy.visit("/web/index.php/leave/applyLeave");
    return this;
  }

  visitMyLeave() {
    cy.visit("/web/index.php/leave/viewMyLeaveList");
    return this;
  }

  visitLeaveList() {
    cy.visit("/web/index.php/leave/viewLeaveList");
    return this;
  }

  get leaveTypeDropdown() {
    return cy.contains("label", "Leave Type").parents(".oxd-input-group").find(".oxd-select-text");
  }
}

export default new LeavePage();
