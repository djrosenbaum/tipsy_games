import { createRoomCode } from './create-room-code';
import { displayScreen } from '../../../library/display-screen';
import { onPlayerListUpdated } from './on-player-list-updated';
import { render } from '../../render';
import { app } from '../../app';

async function Host() {
  const code = createRoomCode();
  const ref = window.firebase.database().ref(`rooms/${code}`);
  let playerList = '';
  
  // remove room from firebase when disconnected
  await ref.onDisconnect().remove();
  
  // set screen
  await ref.set({
    screen: 'lobby',
  }).then(() => {
    displayScreen('lobby');
  });

  return {
    code,
    listen,
    playerList,
    ref,
  }
}

function listen() {
  console.log('listening');
  const { ref } = app.host;
  ref.child('players').on('value', onPlayerListUpdated);
}

export {
  Host,
}