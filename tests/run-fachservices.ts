const modules = [
  './fachservices/authenticated-get-event.spec.ts',
  './fachservices/coordination.spec.ts',
  './fachservices/mfa.spec.ts',
  './fachservices/user-management.spec.ts',
];

let failures = 0;
let executed = 0;

for (const modulePath of modules) {
  const mod = await import(modulePath);
  for (const [name, fn] of Object.entries(mod)) {
    if (!name.startsWith('case') || typeof fn !== 'function') continue;
    executed += 1;
    try {
      await fn();
      console.log(`PASS ${modulePath} :: ${name}`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${modulePath} :: ${name}`);
      console.error(error);
    }
  }
}

if (executed === 0) {
  console.error('No fachservice test cases found.');
  process.exit(1);
}

if (failures > 0) {
  console.error(`${failures} of ${executed} fachservice cases failed.`);
  process.exit(1);
}

console.log(`All ${executed} fachservice cases passed.`);
