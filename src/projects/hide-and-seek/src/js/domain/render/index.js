import { app } from '../app';
import { host } from './host';
import { player } from './player';
import { get } from 'lodash-es';

async function render() {
  console.log('render');
  const playerType = get(app, 'store.game.playerType');
  const screen = get(app, 'store.game.state.screen');
  if (!playerType || !screen) {
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
