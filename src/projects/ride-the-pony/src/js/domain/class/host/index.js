import { createRoomCode } from './createRoomCode';
import { onPlayerListUpdated } from './onPlayerListUpdated';

async function createNewHost() {
  console.log('new host');
  const code = createRoomCode();
  const ref = window.firebase.database().ref(`rooms/${code}`);
  console.log('ref:', ref);

  let playerList = '';

  // remove room from firebase when disconnected
  await ref.onDisconnect().remove();

  console.log('ref set lobby');
  await ref.set({
    screen: 'lobby',
  });

  return {
    code,
    listen,
    playerList,
    ref,
  };
}

function listen() {
  console.log('listening');
  const { ref } = window.app.host;
  ref.child('players').on('value', onPlayerListUpdated);
}

export default {
  createNewHost,
};
