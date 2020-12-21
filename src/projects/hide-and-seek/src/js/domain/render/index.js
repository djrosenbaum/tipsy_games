import { host } from './host';
import { player } from './player';
import { displayScreen } from '../../library/displayScreen';
import { log } from '../../library/log';

async function render({ playerType, screen }) {
  log('render:', 'playerType:', playerType, 'screen:', screen);

  const roomMap = {
    host,
    player,
  };

  (await roomMap[playerType][screen]) && roomMap[playerType][screen]();
  displayScreen(screen);
}

export { render };
