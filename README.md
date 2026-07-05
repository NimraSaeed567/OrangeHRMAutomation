# OrangeHRM Cypress UI Automation

Cypress end-to-end suite for the OrangeHRM open-source demo
(`https://opensource-demo.orangehrmlive.com`), using the Page Object Model.

## Setup

```
npm install
```

## Running

```
npm run cy:open   # interactive runner
npm run cy:run    # headless run of the full suite
```

## Structure

- `cypress/pages` — Page Objects (`LoginPage`, `SidebarPage`, `AdminUserPage`, `PimPage`, `LeavePage`)
- `cypress/e2e` — specs, grouped by module (`admin`, `pim`, `leave`, plus `login.cy.js`)
- `cypress/support/commands.js` — `cy.login()` custom command, cached via `cy.session`

## Covered so far

- **Login**: valid/invalid credentials, required-field validation, forgot-password link
- **Admin > User Management**: search by username/status, no-results state, reset filters, create + delete a user end to end
- **PIM > Employee List**: list rendering, search by name, add + delete an employee end to end
- **Leave**: navigation across Apply Leave / My Leave / Leave List

## Notes

- Login is cached per test run via `cy.session` so each spec doesn't need to
  re-authenticate through the UI.
- Data-creating tests (new user, new employee) clean up after themselves by
  deleting what they create, since this is a shared public demo instance.
- Not yet automated: Recruitment, Performance, Time, Directory, Maintenance,
  Claim, Buzz — good next candidates once the current specs are validated
  against a live run.
