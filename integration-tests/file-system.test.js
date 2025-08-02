/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { strict as assert } from 'assert';
import { test, afterEach } from 'node:test';
import { TestRig } from './test-helper.js';

let rig;

afterEach(() => {
  rig.teardown();
});

test('reads a file', (t) => {
  rig = new TestRig();
  rig.setup(t.name);
  rig.createFile('test.txt', 'hello world');

  const output = rig.run(`read the file name test.txt`);

  assert.ok(output.toLowerCase().includes('hello'));
});

test('writes a file', (t) => {
  rig = new TestRig();
  rig.setup(t.name);
  rig.createFile('test.txt', '');

  rig.run(`edit test.txt to have a hello world message`);

  const fileContent = rig.readFile('test.txt');
  assert.ok(fileContent.toLowerCase().includes('hello'));
});
