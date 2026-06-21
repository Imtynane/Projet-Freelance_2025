import { suggestExercise } from "./src/pages/exerciseBank.js";

const tests = [
  { title: "La seconde guerre mondiale", subject: "Histoire", easinessFactor: 2.5, repetitions: 0 },
  { title: "Langage C", subject: "Programmation", easinessFactor: 2.5, repetitions: 0 },
];

for (const c of tests) {
  const r = suggestExercise(c, null);
  console.log("---", c.title, "---");
  console.log("isKnown:", r.isKnown);
  console.log("exercise:", r.exercise.slice(0, 80), "...");
}