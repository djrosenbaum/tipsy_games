import fs from 'fs';

/**
 * Checks the version of node in .nvmrc against node's process.version
 * Exits if the versions do not match
 *
 * @returns {undefined} - undefined
 */
const enforceNodeVersion = () => {
  const nvmrc = fs.readFileSync('.nvmrc', 'utf8');
  if (nvmrc.trim() !== process.version) {
    console.log(
      `Expected Node Version ${nvmrc} but instead found ${process.version} \n Try typing "nvm use" to switch node versions \n`
    );
    process.exit();
  }
};

enforceNodeVersion();
