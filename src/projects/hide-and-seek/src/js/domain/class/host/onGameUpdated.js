import { render } from '../../render';
import { app } from '../../app';

function onGameUpdated(snapshot) {
  console.log('on game updated', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  console.log('snapshot does exist', snapshot.exists());
  app.game = snapshot.toJSON() || {};

  render({
    playerType: 'host',
    screen: 'game',
  });
}

export { onGameUpdated };
