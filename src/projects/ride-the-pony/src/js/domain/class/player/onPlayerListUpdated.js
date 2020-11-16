import { render } from '../../render';

function onPlayerListUpdated(snapshot) {
  console.log('on player list updated', snapshot);
  window.app.player.playerList = snapshot.exists() ? snapshot.toJSON() : {};
  
  render({
    playerType: 'player',
    screen: 'lobby',
  });
}

export {
  onPlayerListUpdated,
}