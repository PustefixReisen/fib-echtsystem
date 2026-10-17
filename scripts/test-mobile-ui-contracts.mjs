import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const app = readFileSync('apps/editorial-web/src/App.tsx', 'utf8');
const css = readFileSync('apps/editorial-web/src/app.css', 'utf8');

test('mobile navigation has accessible close control and current event position', () => {
  assert.match(app, /className="mobile-nav-close" aria-label="Navigationsmenü schließen"/);
  assert.match(app, /aria-current=\{view === 'events' \|\| view === 'event' \? 'page'/);
  assert.match(css, /\.side-nav\s*\{\s*overflow-y:\s*auto/);
});

test('event filter reset is conditional and accessible', () => {
  assert.match(app, /\{eventSearch && <button[^>]*className="event-filter-reset"[^>]*aria-label="Ereignisfilter löschen"/);
  assert.match(app, /setEventSearch\(''\)/);
});

test('required fields and card status use warning before unsaved indicator', () => {
  assert.match(app, /!editTitle\.trim\(\) \? '⚠ Pflichteingaben unvollständig' : eventDirty/);
  assert.match(app, /!sourceNoteDraft\.trim\(\) \? '⚠ Pflichteingaben unvollständig'/);
  assert.match(app, /aria-invalid=\{!sourceNoteDraft\.trim\(\)\}/);
});

test('finding justification is mandatory before linking and save', () => {
  assert.match(app, /if \(!justification\) \{/);
  assert.match(app, /document.getElementById/);
  assert.match(app, /disabled=\{sourceBusy \|\| !sourceNoteDraft\.trim\(\)/);
});

test('cancel and back both protect modified justification drafts', () => {
  assert.match(app, /sourceNoteDraft !== \(current\?\.justification \?\? ''\) && !window\.confirm/);
  assert.match(app, /Ungespeicherte Änderungen an dieser Zuordnung verwerfen\?/);
});

test('technical import labels remain out of user-facing titles', () => {
  assert.match(app, /function readableEventTitle/);
  assert.match(app, /readableEventTitle\(eventResult\.title\)/);
  assert.match(app, /readableEventTitle\(item\.title\)/);
});

test('source save action has intentional icon-to-text layout', () => {
  assert.match(css, /\.event-source-list li \.finding-justification-editor button\.action-button\s*\{[^}]*display:\s*inline-flex;[^}]*gap:\s*\.8rem/s);
});

test('source workflow actions stay visible and switch by editing context', () => {
  assert.match(app, /className="workflow-action-dock"/);
  assert.match(app, /editingSourceId \? <>/);
  assert.match(app, /aria-label="Aktionen für Fundstellenbearbeitung"/);
  assert.match(css, /\.workflow-action-dock\s*\{[^}]*position:\s*fixed;/s);
  assert.match(css, /\.workflow-dock-host\s*\{[^}]*padding-bottom:/s);
});

test('event form uses fixed save/cancel dock without duplicate controls', () => {
  assert.match(app, /aria-label="Aktionen für Ereignisbearbeitung"/);
  assert.match(app, /className=\{\x60panel card-headed\$\{editingEvent \? " workflow-dock-host"/);
  assert.match(app, /disabled=\{sourcePickerOpen \|\| coordinationRunning/);
  assert.match(app, /disabled=\{editingEvent\} onClick=\{\(\) => \{ setSourcePickerOpen\(true\)/);
});
