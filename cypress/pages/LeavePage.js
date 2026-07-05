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

  selectLeaveType(typeText) {
    this.leaveTypeDropdown.click();
    cy.get(".oxd-select-dropdown").contains("span", typeText).click();
    return this;
  }

  get fromDateInput() {
    return cy.contains("label", "From Date").parents(".oxd-input-group").find("input");
  }

  get toDateInput() {
    return cy.contains("label", "To Date").parents(".oxd-input-group").find("input");
  }

  get applyButton() {
    return cy.contains("button", "Apply");
  }
}

export default new LeavePage();
