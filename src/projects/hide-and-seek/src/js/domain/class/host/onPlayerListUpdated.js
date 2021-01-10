import { render } from '../../render';
import { app } from '../../app';

function onPlayerListUpdated(snapshot) {
  console.log('on player list updated', snapshot);
  app.playerList = snapshot.exists() ? snapshot.toJSON() : {};

  render({
    playerType: 'host',
    screen: 'lobby',
  });
}

export { onPlayerListUpdated };
