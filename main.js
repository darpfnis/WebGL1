// ── main.js ──
// Entry point — imports all tasks and runs them on page load

import { task1 } from './task1.js';
import { task2 } from './task2.js';
import { task3 } from './task3.js';
import { task4 } from './task4.js';

window.onload = function () {
  task1();
  task2();
  task3();
  task4();
};