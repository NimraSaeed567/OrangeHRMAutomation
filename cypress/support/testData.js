const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Jamie"];
const LAST_NAMES = ["Bennett", "Coleman", "Reyes", "Foster", "Bailey", "Nguyen", "Patel", "Rossi"];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Short, non-numeric-looking, still unique per call - avoids leaving raw
// millisecond timestamps as visible test data in a shared public demo.
// Mixes in Math.random() because Date.now() alone can repeat when multiple
// values are generated within the same millisecond (e.g. two calls back to
// back in one test).
export function uniqueSuffix() {
  const time = Date.now().toString(36).slice(-3);
  const rand = Math.floor(Math.random() * 36 ** 2)
    .toString(36)
    .padStart(2, "0");
  return `${time}${rand}`;
}

export function randomPersonName() {
  return { firstName: pick(FIRST_NAMES), lastName: `${pick(LAST_NAMES)}${uniqueSuffix()}` };
}

export function randomUsername() {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return `${firstName}.${lastName}.${uniqueSuffix()}`.toLowerCase();
}

export function randomCandidate() {
  const { firstName, lastName } = randomPersonName();
  const email = `${firstName}.${lastName}@example.com`.toLowerCase();
  return { firstName, lastName, email };
}

const JOB_TITLE_WORDS = ["Analyst", "Engineer", "Coordinator", "Specialist", "Consultant", "Associate"];

export function randomJobTitle() {
  return `QA ${pick(JOB_TITLE_WORDS)} ${uniqueSuffix()}`;
}

export function randomNationality() {
  return `Cy Land ${uniqueSuffix()}`;
}
