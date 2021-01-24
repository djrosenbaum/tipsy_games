import { render } from '../../render';
import { app } from '../../app';

export function onGameUpdate(snapshot) {
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  const { payload } = snapshot.toJSON();
  console.log('on game updated payload', payload);

  if (!payload) {
    return;
  }

  Object.assign(app.store.game.state, payload);

  render({
    playerType: 'host',
    screen: 'game',
  });
}
