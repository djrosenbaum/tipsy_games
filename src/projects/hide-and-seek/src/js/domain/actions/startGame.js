import { app } from '../app';
import { get } from 'lodash-es';
import { getActivePlayers } from '../../domain/render/shared/getActivePlayers';

async function startGame() {
  console.log('start game');

  if (app.store.isBusy) {
    return;
  }
  app.store.isBusy = true;

  const gameRef = get(app, 'store.game.ref');
  const activePlayers = Object.keys(getActivePlayers());
  console.log('active players:', activePlayers);

  await gameRef.child('public').push({
    type: 'start_game',
    payload: JSON.stringify({
      screen: 'game',
      stage: 'intro',
      activePlayers,
    }),
  });

  app.store.isBusy = false;
}

export { startGame };
