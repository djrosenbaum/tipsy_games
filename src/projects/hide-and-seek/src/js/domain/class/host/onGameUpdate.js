import { render } from '../../render';
import { app } from '../../app';
import { get } from 'lodash-es';

export function onGameUpdate(snapshot) {
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  let { payload, type } = snapshot.toJSON();
  console.log('on game update', payload, type);
  if (!payload || !type) {
    return;
  }

  const { state } = get(app, 'store.game');

  payload = JSON.parse(payload);
  console.log('payload', payload);

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

  // render the current game screen
  render();
}
