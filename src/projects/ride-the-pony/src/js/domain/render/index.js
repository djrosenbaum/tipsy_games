import { host } from './host';
import { player } from './player';
import { displayScreen } from '../../library/display-screen';

async function render({ playerType, screen }) {
  console.log('render:', playerType, screen);

  const roomMap = {
    host,
    player,
  }

  await roomMap[playerType][screen]();
  displayScreen(screen);
}

export {
  render,
}