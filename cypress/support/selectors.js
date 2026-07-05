// Suggestion items in the "Type for hints..." autocomplete may render as
// <li>, a "oxd-autocomplete-option" div, or a plain child div depending on
// version - match whichever is actually there instead of betting on one
// unconfirmed structure.
export const AUTOCOMPLETE_OPTION_SELECTOR = [
  ".oxd-autocomplete-dropdown li",
  ".oxd-autocomplete-dropdown [class*='option']",
  ".oxd-autocomplete-dropdown > div",
].join(", ");
