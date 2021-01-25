import { app } from '../app';
import { host } from './host';
import { player } from './player';
import { get } from 'lodash-es';

async function render({ screen }) {
  const playerType = get(app, 'store.game.playerType');
  if (!playerType) {
    return;
  }
  console.log('render:', playerType, screen);

  const screenMap = {
    host,
    player,
  };

  await screenMap[playerType][screen]();
}

export { render };
