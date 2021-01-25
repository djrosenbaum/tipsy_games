import { render } from '../../render';
import { app } from '../../app';
import { get, merge } from 'lodash-es';

export function onGameUpdate(snapshot) {
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  let { payload } = snapshot.toJSON();
  console.log('on game updated payload', payload);
  if (!payload) {
    return;
  }

  const state = get(app, 'store.game.state');
  if (!state) {
    return;
  }

  payload = JSON.parse(payload);

  // assign the updated payload to state
  merge(state, payload);

  // render the current game screen
  render({
    screen: state.screen,
  });
}
