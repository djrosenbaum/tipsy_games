import { app } from '../../app';
import { render } from '../../render';

function onPlayerListUpdated(snapshot) {
  console.log('on player list updated', snapshot);
  app.player.playerList = snapshot.exists() ? snapshot.toJSON() : {};
  
  render({
    playerType: 'player',
    screen: 'lobby',
  });
}

export {
  onPlayerListUpdated,
}