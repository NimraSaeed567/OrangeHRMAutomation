class SidebarPage {
  get menu() {
    return cy.get(".oxd-main-menu");
  }

  goTo(itemName) {
    this.menu.contains(".oxd-main-menu-item span", itemName).click();
    return this;
  }
}

export default new SidebarPage();
