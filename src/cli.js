// cli user interface
// https://www.npmjs.com/package/inquirer
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const checkNodeVersion = () => {
  // check the node version
  const nvmrc = fs.readFileSync('.nvmrc', 'utf8');
  if (nvmrc !== process.version) {
    console.log(
      `Expected Node Version ${nvmrc} but instead found ${process.version} \n Try typing "nvm use" to switch node versions \n`
    );
    process.exit();
  }
};

const getGameList = () => {
  const projects = path.join('', 'projects');
  const files = fs.readdirSync(projects);

  return files.filter((file) => !file.startsWith('.'));
};

const buildGame = (answer) => {
  execSync(`CLIENT=${answer.game} npm run dev`, {
    stdio: 'inherit',
  });
};

const inquire = () => {
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
};

checkNodeVersion();
inquire();
