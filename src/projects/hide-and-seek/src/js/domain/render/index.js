import { app } from '../app';
import { host } from './host';
import { player } from './player';
import { displayScreen } from '../../library/displayScreen';
import { log } from '../../library/log';

async function render({ screen }) {
  const { playerType } = app;

  const screenMap = {
    host,
    player,
  };

  await screenMap[playerType][screen]();
}

export { render };
