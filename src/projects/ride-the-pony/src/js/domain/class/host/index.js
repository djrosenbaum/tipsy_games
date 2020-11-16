import { createRoomCode } from './createRoomCode';
import { onPlayerListUpdated } from './onPlayerListUpdated';

async function Host() {
  console.log('new host');
  const code = createRoomCode();
  const ref = window.firebase.database().ref(`rooms/${code}`);
  
  let playerList = '';
  
  // remove room from firebase when disconnected
  await ref.onDisconnect().remove();

  await ref.set({
    screen: 'lobby',
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
  const { ref } = window.app.host;
  ref.child('players').on('value', onPlayerListUpdated);
}

export {
  Host,
}