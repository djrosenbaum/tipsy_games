import { render } from '../../render';
import { app } from '../../app';
import { get } from 'lodash-es';

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
  console.log('payload');

  if (type === 'screen') {
    state.screen = payload.screen;
  }

  // render the current game screen
  render();
}
