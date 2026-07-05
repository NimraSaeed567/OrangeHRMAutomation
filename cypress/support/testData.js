const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Jamie"];
const LAST_NAMES = ["Bennett", "Coleman", "Reyes", "Foster", "Bailey", "Nguyen", "Patel", "Rossi"];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Short, non-numeric-looking, still unique per run - avoids leaving raw
// millisecond timestamps as visible test data in a shared public demo.
export function uniqueSuffix() {
  return Date.now().toString(36).slice(-4);
}

export function randomPersonName() {
  return { firstName: pick(FIRST_NAMES), lastName: `${pick(LAST_NAMES)}${uniqueSuffix()}` };
}

export function randomUsername() {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return `${firstName}.${lastName}.${uniqueSuffix()}`.toLowerCase();
}
