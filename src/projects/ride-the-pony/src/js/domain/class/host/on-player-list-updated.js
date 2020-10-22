import { app } from '../../app';
import { render } from '../../render';

function onPlayerListUpdated(snapshot) {
  console.log('on player list updated', snapshot);
  app.host.playerList = snapshot.exists() ? snapshot.toJSON() : {};
  
  render({
    playerType: 'host',
    screen: 'lobby',
  });
}

export {
  onPlayerListUpdated,
}