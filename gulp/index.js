'use strict';

import fs          from 'fs';
import onlyScripts from './util/script-filter';

const TASKS = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

TASKS.forEach(function(task) {
  require('./tasks/' + task);
});
