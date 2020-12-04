// cli user interface
// https://www.npmjs.com/package/inquirer
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.join('');

function getGameList() {
  const projects = path.join(__dirname, 'projects');
  const files = fs.readdirSync(projects);

  return files.filter((file) => !file.startsWith('.'));
}

function buildGame(answer) {
  execSync(`CLIENT=${answer.game} npm run dev`, {
    stdio: 'inherit',
  });
}

inquirer
  .prompt([
    {
      type: 'list',
      name: 'game',
      message: 'select a game',
      choices: getGameList(),
    },
  ])
  .then(buildGame);
