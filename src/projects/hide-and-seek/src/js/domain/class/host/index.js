import { createRoomCode } from './createRoomCode';
import { onPlayerListUpdated } from './onPlayerListUpdated';
import { onGameUpdated } from './onGameUpdated';
import { app } from '../../app';

async function createNewHost() {
  console.log('new host');
  const code = createRoomCode();
  const ref = window.firebase.database().ref(`rooms/${code}`);
  const playerType = 'host';
  console.log('ref:', ref);

  let playerList = '';

  // remove room from firebase when disconnected
  await ref.onDisconnect().remove();

  console.log('ref set lobby');
  await ref.set({
    screen: 'lobby',
  });

  const host = {
    code,
    listen,
    playerList,
    playerType,
    ref,
  };

  Object.assign(app, host);
}

function listen() {
  console.log('listening');
  const { ref } = app;
  ref.child('players').on('value', onPlayerListUpdated);
  ref.child('game').on('value', onGameUpdated);
}

export { createNewHost };
