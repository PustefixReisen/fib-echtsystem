// Synthetic values only; exercise the actual controls without submitting a form.
export async function checkPasswordVisibility(page, labels, check, context) {
  let requests = 0;
  const count = request => { if (request.url().includes('/auth/v1/')) requests++; };
  page.on('request', count);
  const beforeStorage = await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]));
  for (const label of labels) {
    const field = page.getByLabel(label, { exact: true });
    const original = await field.inputValue();
    const show = page.getByRole('button', { name: label + ' anzeigen', exact: true });
    let ok = await field.getAttribute('type') === 'password';
    await field.fill('Synthetic-visibility-only-123');
    await show.click();
    const hide = page.getByRole('button', { name: label + ' verbergen', exact: true });
    ok &&= await field.getAttribute('type') === 'text' && await field.inputValue() === 'Synthetic-visibility-only-123';
    ok &&= await hide.getAttribute('title') === label + ' verbergen' && await hide.getAttribute('aria-pressed') === 'true';
    ok &&= await hide.getAttribute('type') === 'button';
    for (const other of labels.filter(other => other !== label)) {
      ok &&= await page.getByLabel(other, { exact: true }).getAttribute('type') === 'password';
    }
    await hide.press('Space');
    ok &&= await field.getAttribute('type') === 'password';
    await show.press('Enter');
    ok &&= await field.getAttribute('type') === 'text';
    await field.fill('');
    await page.waitForFunction(id => document.getElementById(id)?.type === 'password', await field.getAttribute('id'));
    ok &&= await show.getAttribute('title') === label + ' anzeigen';
    await field.fill(original);
    check(context + ': ' + label + ' starts hidden, toggles by mouse/keyboard and hides on clear', ok);
  }
  page.off('request', count);
  check(context + ': visibility controls send no Auth request and persist nothing', requests === 0 && beforeStorage === await page.evaluate(() => JSON.stringify([localStorage, sessionStorage])));
}
