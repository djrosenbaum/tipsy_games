// cli user interface
// https://www.npmjs.com/package/inquirer
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGameList() {
  const projects = path.join(__dirname, 'projects');
  const files = fs.readdirSync(projects);

  return files.filter(file => !file.startsWith('.'));
}

function buildGame(answer) {
  execSync(`CLIENT=${answer.game} npm run dev`, {
    stdio: 'inherit'
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