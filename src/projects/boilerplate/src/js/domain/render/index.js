import { host } from './host';
import { player } from './player';

function render({ playerType, screen }) {
  console.log('render:', playerType, screen);

  const roomMap = {
    host,
    player,
  }

  roomMap[playerType][screen]();
}

export {
  render,
}