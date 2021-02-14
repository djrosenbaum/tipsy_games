import { app } from '../app';
import { get } from 'lodash-es';

async function startGame() {
  console.log('start game');

  if (app.store.isBusy) {
    return;
  }
  app.store.isBusy = true;

  const gameRef = get(app, 'store.game.ref');

  await gameRef.child('public').push({
    type: 'screen',
    payload: JSON.stringify({
      screen: 'game',
    }),
  });

  app.store.isBusy = false;
}

export { startGame };
