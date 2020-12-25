import { render } from '../../render';

function onGameUpdated(snapshot) {
  console.log('on game updated', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  console.log('snapshot does exist', snapshot.exists());
  window.app.player.game = snapshot.toJSON() || {};

  render({
    playerType: 'player',
    screen: 'game',
  });
}

export { onGameUpdated };
