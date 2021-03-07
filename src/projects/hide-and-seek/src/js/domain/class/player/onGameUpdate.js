import { render } from '../../render';
import { app } from '../../app';
import { get, set } from 'lodash-es';

export function onGameUpdate(snapshot) {
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  let { payload, type } = snapshot.toJSON();
  console.log('on game updated payload', payload);
  if (!payload || !type) {
    return;
  }

  const state = get(app, 'store.game.state');

  payload = JSON.parse(payload);
  console.log('type:', type);
  console.log('payload:', payload);

  const { screen, stage, activePlayers } = payload;

  if (screen) {
    state.screen = screen;
  }
  if (stage) {
    console.log('new stage', stage);
    state.stage = stage;

    if (stage === 'intro') {
      state.players = activePlayers.reduce((acc, val) => {
        acc[val] = {};
        return acc;
      }, {});
    }
  }
  if (type === 'hidden') {
    const { playerId } = payload;
    // give the player 3 treasure
    console.log('player id:', playerId);
    set(app, `store.game.state.players.${playerId}.treasure`, 3);
  }

  // render the current game screen
  render();
}
